import fakeua from "fake-useragent";
import { v4 } from "uuid";
import { imageSize } from "image-size";
import {
  BaseResponse,
  InskeepPost,
  InskeepwPostResponse,
  LoginData,
  UserList,
  UserInfo,
  InskeepSearchData,
} from "../types/response/inskeep";
import { Post, ResourceType, UploadMedia } from "./upload";
import { DataBase } from "../database/db";
import { sleep } from "bun";
import { retry } from "retry-anything";
import axios from "axios";
import { categoryMap } from "../constants";
import { imginnFetchPost, ImginnParams } from "./imginn";

export class InskeepCrawler {
  private db!: DataBase;
  private force!: boolean;
  private token!: string;
  private headers!: Headers;
  private deviceId: string = v4().slice(0, 32);
  private async login() {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept-Language", "zh-CN,zh-Hans;q=0.9");
    const ua = fakeua();
    let platform = "macos";
    // 判断 iOS
    if (/iPad|iPhone|iPod/.test(ua)) {
      platform = "ios";
    }
    // 判断 Android
    if (/android/i.test(ua)) {
      platform = "android";
    }
    // 默认返回未知
    this.headers.append("User-Agent", fakeua());
    const body = JSON.stringify({
      deviceId: this.deviceId,
      system: "",
      platform,
    });
    await retry({
      adapter: async () => {
        const res = await fetch("https://api.inskeep.cn/v2/app/api/user/init", {
          method: "POST",
          headers: this.headers,
          body,
        }).then(
          (response) =>
            response.json() as unknown as Promise<BaseResponse<LoginData>>
        );
        if (res.errcode === 0) {
          this.token = `Bearer ${res.data.token}`;
        }
        return res.errcode === 0;
      },
    });
    if (!this.token) {
      throw new Error("登录失败，无法获取token");
    }
    this.headers.append("Authorization", this.token);
  }
  private async fetch<T>(
    url: string,
    { method, params }: { method: "GET" | "POST"; params?: any }
  ) {
    if (method === "GET") {
      url = axios.getUri({
        baseURL: url,
        params: {
          ...params,
          t: new Date().getTime(),
          r: Math.floor(1e4 * Math.random()),
          v: "v2.0.0",
          e: this.deviceId,
        },
      });
    }
    console.log("request url:", url);
    const res = await fetch(url, {
      method,
      headers: this.headers,
      body: params && method === "POST" ? JSON.stringify(params) : undefined,
    });
    const data = await (res.json() as unknown as Promise<BaseResponse<T>>);
    if (data.errcode !== 0) {
      return null;
    }
    return data.data;
  }
  async init(force = false) {
    this.force = force;
    this.db = new DataBase();
    await this.db.connect();
    await this.login();
  }

  async getStarWithCategoryId() {
    if (!this.db) {
      return [];
    }
    return this.db.getStarWithCategoryId();
  }
  async getRankList() {
    return [
      // { id: 0, title: "推荐" },
      // { id: 1, title: "热门" },
      { id: 2, title: "内地" },
      { id: 3, title: "港台" },
      { id: 4, title: "韩国" },
      { id: 5, title: "日本" },
      { id: 6, title: "泰国" },
      { id: 7, title: "欧美" },
      { id: 8, title: "穿搭" },
      { id: 9, title: "体育" },
      { id: 10, title: "品牌" },
    ];
  }

  async fetchUserRank(group_id: number, offset = 0) {
    // 获取港台前x位明星，只需要修改limit参数与offset参数即可
    const res = await this.fetch<UserList>(
      "https://api.inskeep.cn/v2/app/api/owner/tag",
      {
        method: "POST",
        params: {
          tagId: String(group_id),
          offset,
        },
      }
    );
    if (!res) {
      return;
    }
    return res;
  }
  private async getUserInfo(starId: string, categoryId: number) {
    const user = await this.fetch<UserInfo>(
      "https://api.inskeep.cn/v2/app/api/owner/user",
      {
        method: "GET",
        params: {
          userId: starId,
        },
      }
    );
    if (!user) return;
    const userInfo = await this.searchUserInfoByName(user.userName);
    if (!userInfo) return;
    console.log("获取到用户信息", userInfo);
    const uploadMedia = new UploadMedia();

    const avatar = await uploadMedia.upload(userInfo.avatar, "image");
    const star = await this.db.getStarByInsStarId(starId);
    return {
      insStarId: userInfo.user_id,
      avatar,
      starName: userInfo.username || star?.starName,
      fullName: userInfo.full_name || star?.fullName,
      zhName: userInfo.full_name || star?.zhName,
      postCount: user.mediaCount,
      followerCount: user.followers || userInfo.followers,
      followingCount: user.following,
      categoryId:
        categoryId || categoryMap.get(userInfo.tag_id) || star?.categoryId || 0,
    };
  }
  private async searchUserInfoByName(fullName: string) {
    let list: InskeepSearchData["list"] = [];
    await retry({
      adapter: async () => {
        try {
          const res = await this.fetch<InskeepSearchData>(
            "https://api.inskeep.cn/v2/app/api/owner/search",
            {
              method: "POST",
              params: {
                keyword: fullName,
              },
            }
          );
          if (res && res.list.length) {
            list = res.list;
          }
          return !!(res && res.list.length);
        } catch {
          return false;
        }
      },
    });
    return list.find((user) => user.full_name.trim() === fullName.trim());
  }
  private async *getFirstPage(options: {
    starId: string;
    categoryId?: number;
    userName?: string;
    fullName?: string;
  }): AsyncGenerator<Post[]> {
    const { starId, categoryId = 0, userName, fullName } = options;
    try {
      const user = await this.getUserInfo(starId, categoryId);
      if (!user) return;
      if (userName) {
        user.starName = userName;
      }
      if (fullName) {
        user.fullName = fullName;
        user.zhName = fullName;
      }
      await this.db.saveUser(user);
      console.log("用户信息已保存至db", user);
      const recentlyId = await this.db.getFirstPostId(user?.insStarId);
      console.log("recentlyId", recentlyId);
      let hasMore = true;
      let offset = 0;
      while (hasMore) {
        const nextPageData = await this.getNextPageData(user.insStarId, offset);
        if (!nextPageData) {
          break;
        }
        console.log(
          `获取到数据，offset: ${offset}，size: ${nextPageData.length}`
        );
        hasMore = !!nextPageData.length;
        const ps = await Promise.all(
          this.extraPost(nextPageData, user.starName, user.fullName)
        );
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
        offset++;
      }
    } catch (error) {
      console.log("getFirstPage error", error);
      yield [];
    }
  }
  private async *getFirstPageByInn(options: {
    starId: string;
    categoryId?: number;
    userName?: string;
    fullName?: string;
  }): AsyncGenerator<Post[]> {
    const { starId, categoryId = 0, userName, fullName } = options;
    try {
      const user = await this.getUserInfo(starId, categoryId);
      if (!user) return;
      if (userName) {
        user.starName = userName;
      }
      if (fullName) {
        user.fullName = fullName;
        user.zhName = fullName;
      }
      await this.db.saveUser(user);
      console.log("用户信息已保存至db", user);
      const recentlyId = await this.db.getFirstPostId(user?.insStarId);
      console.log("recentlyId", recentlyId);
      let hasMore = true;
      let cursor = "";
      while (hasMore) {
        const nextPageData = await this.getNextPageDataByImginn({
          id: user.insStarId,
          cursor,
          username: user.starName || "",
          verified: 0,
        });
        if (!nextPageData) {
          break;
        }
        console.log(
          `获取到数据，cursor: ${cursor}，size: ${nextPageData.items.length}`
        );
        hasMore = nextPageData.hasNext;
        cursor = nextPageData.cursor;
        const canExtraPosts = nextPageData.items
          .filter((item) => !item.isPind)
          .map(
            (item) =>
              ({
                id: item.id,
                userId: user.insStarId,
                userName: user.starName || "",
                content: item.alt,
                takeAt: item.date,
                mainImage: item.thumb,
                userImage: user.avatar,
                sources: item.srcs.map((src) => {
                  if (item.isSidecar) {
                    const isVideo = src.includes(".mp4?");

                    return {
                      type: isVideo ? "video" : "image",
                      url: src,
                      thumbnailUrl: isVideo ? item.thumb : src,
                      id: 0,
                    };
                  }
                  return {
                    type: item.isVideo ? "video" : "image",
                    url: src,
                    thumbnailUrl: item.isVideo ? item.thumb : "image",
                    id: 0,
                  };
                }),
                likeCount: item.likeCount,
                mediaCount: 0,
                commentCount: item.commentCount,
                isVideo: false,
                isBookmarked: false,
                isFollowed: false,
                isLiked: false,
              } satisfies InskeepPost)
          );
        const ps = await Promise.all(
          this.extraPost(canExtraPosts, user.starName, user.fullName)
        );
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
      }
    } catch (error) {
      console.log("getFirstPageByInn error", error);
      yield [];
    }
  }

  private async getNextPageDataByImginn(data: ImginnParams) {
    const d = await imginnFetchPost(data);
    if (d.code !== 200) {
      return null;
    }
    return d;
  }
  private async getNextPageData(userId: string, offset = 0) {
    try {
      let res: InskeepPost[] | null = null;
      await retry({
        interval: 5000,
        adapter: async () => {
          try {
            const d = await this.fetch<InskeepwPostResponse>(
              "https://api.inskeep.cn/v2/app/api/owner/media",
              {
                method: "GET",
                params: {
                  offset,
                  userId,
                },
              }
            );
            if (d) {
              res = d.data;
            }
            return !!d;
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

  private extraPost(
    posts: InskeepPost[],
    startName?: string,
    fullName?: string
  ) {
    const getImageInfoByUrl = async (url: string) => {
      try {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const { width, height } = imageSize(Buffer.from(buffer));
        console.log("获取到图片宽高", width, height);
        return {
          width,
          height,
        };
      } catch {
        return {
          width: 0,
          height: 0,
        };
      }
    };

    const extraAttachment = (post: InskeepPost) => {
      return post.sources!.map(async (item) => ({
        type: item.type as ResourceType,
        url: item.url.replace("http://", "https://"),
        thumbnail_url:
          item.type === "video"
            ? post.mainImage.replace("http://", "https://")
            : item.url.replace("http://", "https://"),
        ...(await getImageInfoByUrl(
          item.type === "video"
            ? post.mainImage.replace("http://", "https://")
            : item.url.replace("http://", "https://")
        )),
      }));
    };

    return posts
      .filter((post) => !!post.sources)
      .map(async (post) => {
        return {
          insPostId: `${post.id}_${post.userId}`,
          starName: startName ?? post.userName,
          fullName: fullName ?? post.userName,
          title: post.content,
          publishTime: post.takeAt,
          insStarId: post.userId,
          isTop: false,
          resources: await Promise.all(extraAttachment(post)),
        };
      });
  }

  async run(options: {
    starId: string;
    categoryId?: number;
    fullName?: string;
    userName?: string;
    force?: boolean;
  }) {
    const { force, starId, categoryId, userName, fullName } = options;
    if (force !== void 0) {
      this.force = force;
    }
    const postsIterator = this.getFirstPageByInn({
      starId,
      categoryId,
      fullName: fullName === "undefined" ? undefined : fullName,
      userName: userName === "undefined" ? undefined : userName,
    });
    // const postsIterator = this.getFirstPage({
    //   starId,
    //   categoryId,
    //   fullName: fullName === "undefined" ? undefined : fullName,
    //   userName: userName === "undefined" ? undefined : userName,
    // });
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
