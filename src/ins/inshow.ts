import {
  BaseResponse,
  InShowPostResponse,
  InShowUserInfo,
} from "../types/response/inshow";
import { Post, ResourceType, UploadMedia } from "./upload";
import { DataBase } from "../database/db";
import { sleep } from "bun";
import { retry } from "retry-anything";
import { INSHOW_MEDIA_HOST, JWTTokens } from "../constants";
import dayjs from "dayjs";
import { JWTManager, JWTToken } from "../utils/dynamic-token";

export class InshowCrawler {
  private db!: DataBase;
  private force!: boolean;
  jwtManage!: JWTManager;
  private async fetch<T>(url: string) {
    let tokenObj: JWTToken | null = null;
    let times = 0;
    while (!tokenObj) {
      tokenObj = this.jwtManage.getNextToken();
      if (!tokenObj) {
        times++;
        if (times >= JWTTokens.length) {
          return null;
        }
        await sleep(500);
      }
    }
    const myHeaders = new Headers();
    myHeaders.append("Host", "apip.inshowapp.cn");
    myHeaders.append("inshow-platform", "ios");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("inshow-version", "190");
    myHeaders.append("Accept", "*/*");
    myHeaders.append(
      "User-Agent",
      "inshow/1.3.4 (com.xiyao.inshowApp; build:190; iOS 18.6.0) Alamofire/5.10.2"
    );
    myHeaders.append("Authorization", tokenObj.token);
    myHeaders.append("Accept-Language", "zh-Hans-CN;q=1.0");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const res = await fetch(url, requestOptions);
    const data = await (res.json() as unknown as Promise<BaseResponse<T>>);
    if (data.code !== 200) {
      this.jwtManage.reportFailure(tokenObj)
      return null;
    }
    this.jwtManage.reportSuccess(tokenObj)
    return data.data;
  }
  async init(force = false) {
    this.force = force;
    this.db = new DataBase();
    this.jwtManage = new JWTManager(JWTTokens);
    await this.db.connect();
  }

  async getStarWithCategoryId() {
    if (!this.db) {
      return [];
    }
    return this.db.getStarWithCategoryId();
  }
  async getRankList() {
    return this.fetch<{ id: number; name: string; idx: number }[]>(
      "https://apip.inshowapp.cn/api/page/groups/rankings"
    );
  }

  async fetchUserRank(group_id: number) {
    //#region 榜单分类
    // [
    //   {
    //     id: 3,
    //     name: "内地",
    //     idx: 1,
    //   },
    //   {
    //     id: 4,
    //     name: "港台",
    //     idx: 2,
    //   },
    //   {
    //     id: 5,
    //     name: "韩国",
    //     idx: 3,
    //   },
    //   {
    //     id: 6,
    //     name: "日本",
    //     idx: 4,
    //   },
    //   {
    //     id: 7,
    //     name: "泰国",
    //     idx: 5,
    //   },
    //   {
    //     id: 8,
    //     name: "欧美",
    //     idx: 6,
    //   },
    //   {
    //     id: 19,
    //     name: "穿搭",
    //     idx: 7,
    //   },
    //   {
    //     id: 18,
    //     name: "时尚品牌",
    //     idx: 8,
    //   },
    // ];
    // https://apip.inshowapp.cn/api/page/groups/rankings
    // await this.fetch<{ id: number; name: string }>(
    //   "https://apip.inshowapp.cn/api/page/groups/rankings"
    // );
    //#endregion
    // 获取港台前x位明星，只需要修改limit参数与offset参数即可
    const res = await this.fetch<{ results: InShowUserInfo[] }>(
      `https://apip.inshowapp.cn/api/page/groups/pages?limit=99&offset=0&group_id=${group_id}&order_type=hot`
    );
    if (!res) {
      return;
    }
    return res.results;
  }
  private async getUserInfo(starId: string) {
    console.log("获取用户信息");
    const user = await this.fetch<InShowUserInfo>(
      `https://apip.inshowapp.cn/api/pages/info?page_id=${starId}`
    );
    if (!user) return;
    console.log("获取到用户信息");
    const uploadMedia = new UploadMedia();
    const {
      page_id: insStarId,
      avatar_s3,
      nickname: fullName,
      username: starName,
      follows_count: followingCount,
      followers_count: followerCount,
      media_count: postCount,
      display_name: zhName,
    } = user;
    const avatar = await uploadMedia.upload(
      `${INSHOW_MEDIA_HOST}${avatar_s3}`,
      "image"
    );
    return {
      insStarId,
      avatar,
      starName,
      fullName,
      zhName,
      postCount,
      followerCount,
      followingCount,
    };
  }

  private async *getFirstPage(
    starId: string,
    categoryId = 0
  ): AsyncGenerator<Post[]> {
    try {
      const user = await this.getUserInfo(starId);
      if (!user) return;
      await this.db.saveUser({ ...user, categoryId });
      console.log("用户信息已保存至db", user);
      const recentlyId = await this.db.getFirstPostId(user?.insStarId);
      console.log("recentlyId", recentlyId);
      let hasMore = true;
      let offset = 0;
      const limit = 100;

      while (hasMore) {
        const nextPageData = await this.getNextPageData(
          user.insStarId,
          offset,
          limit
        );
        if (!nextPageData) {
          break;
        }
        console.log(
          `获取到数据，offset: ${offset}，size: ${nextPageData.results.length}`
        );
        hasMore = !!nextPageData.next;
        const ps = this.extraPost(nextPageData);
        // 不是置顶数据并且数据库中存在该数据
        const idx = ps.findIndex(
          (post) => post.insPostId === recentlyId && !post.isTop
        );
        if (idx !== -1 && !this.force) {
          console.log(
            "数据库中存在该数据，只抓取该数据之前的数据，表示已全部加载完成"
          );
          yield ps.slice(0, idx);
          break;
        }
        yield ps;
        console.log("已添加到posts", hasMore);
        if (!hasMore) {
          break;
        }
        await sleep(2000);
        offset += limit;
      }
    } catch (error) {
      console.log("getFirstPage error", error);
      yield [];
    }
  }

  private async getNextPageData(starId: string, offset = 0, limit = 100) {
    const url = `https://apip.inshowapp.cn/api/medias?limit=${limit}&offset=${offset}&page_id=${starId}`;
    try {
      let res: InShowPostResponse | null = null;
      await retry({
        interval: 5000,
        adapter: async () => {
          try {
            res = await this.fetch<InShowPostResponse>(url);
            return !!res;
          } catch (error) {
            return false;
          }
        },
      });
      console.log("获取到次级页面数据");
      return res!;
    } catch (error) {
      console.log("次级页面报错", error);
      return null;
    }
  }

  private extraPost(data: InShowPostResponse) {
    const { results } = data;

    interface Source {
      media_type: "image" | "video";
      media_url: string;
      media_url_s3: string;
      width: number;
      height: number;
      video_url_s3?: string;
    }
    const extraAttachment = (source: Source[]) => {
      return source.map((item) => ({
        type: item.media_type as ResourceType,
        url:
          item.media_type === "video"
            ? `${INSHOW_MEDIA_HOST}${item.video_url_s3}`
            : `${INSHOW_MEDIA_HOST}${item.media_url_s3}`,
        thumbnail_url: `${INSHOW_MEDIA_HOST}${item.media_url_s3}`,
        width: item.width,
        height: item.height,
      }));
    };

    return results.map((edge) => {
      const {
        page,
        media_create_time,
        attachments,
        page_id: insStarId,
        media_id: insPostId,
        caption,
      } = edge;

      const source = JSON.parse(attachments);

      return {
        insPostId: `${insPostId}_${insStarId}`,
        starName: page.username,
        fullName: page.nickname,
        title: caption,
        publishTime: dayjs(media_create_time).unix(),
        insStarId,
        isTop: false,
        resources: extraAttachment(source),
      };
    });
  }

  async run(options: { starId: string; categoryId?: number; force?: boolean }) {
    const { force, starId, categoryId } = options;
    if (force !== void 0) {
      this.force = force;
    }
    const postsIterator = this.getFirstPage(starId, categoryId);
    const uploadMedia = new UploadMedia();
    for await (const originalPosts of postsIterator) {
      if (!originalPosts.length) {
        continue;
      }
      const formatPosts = await uploadMedia.uploadMulMeidaToCdn(originalPosts);
      console.log("本次请求共有", formatPosts.length, "条数据");
      if (!formatPosts.length) {
        continue;
      }
      await this.db.savePosts(formatPosts);
    }
    uploadMedia.multibar.stop();
  }

  async dispose() {
    await this.db.close();
  }
}
