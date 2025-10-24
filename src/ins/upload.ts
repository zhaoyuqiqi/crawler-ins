import { fetch } from "bun";
import { MultiBar } from "cli-progress";
import colors from "colors";
import pLimit from "p-limit";
import { retry } from "retry-anything";

export type ResourceType = "image" | "video";

export interface Post {
  insPostId: string;
  starName: string;
  fullName: string;
  title: string;
  isTop: boolean;
  insStarId: string;
  publishTime: number;
  resources: Resource[];
}
export interface Resource {
  type: ResourceType;
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
}

const limit = pLimit(10);
export class UploadMedia {
  multibar: MultiBar;
  constructor() {
    // 创建多进度条容器
    this.multibar = new MultiBar({
      format: `{filename} | ${colors.cyan(
        "{bar}"
      )} | {percentage}% | {value}/{total} | ETA: {eta}s`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      clearOnComplete: false,
      stopOnComplete: true,
    });
  }
  private async prefetchHeaders(originUrl: string) {
    try {
      if (originUrl.includes("cdninstagram.com")) {
        const url = new URL(originUrl);
        url.host = "instar-cdn.zhaoyuqi.top";
        const fetchUrl = url.toString();
        const response = await fetch(fetchUrl, {
          method: "HEAD", // 关键：使用 HEAD 方法
          mode: "no-cors", // 绕过简单跨域限制（但无法读取响应头）
        });
        console.log("预请求HTTP 状态码:", response.status, fetchUrl);
      }
      // 注意：跨域情况下无法读取头信息（除非服务器返回 CORS 头）
    } catch (e) {
      console.error("cdn预请求失败:", e);
    }
  }
  private async throttleUpload(url: string, type: ResourceType) {
    this.prefetchHeaders(url);
    return url;
    try {
      const body = {
        infos: [
          {
            type,
            url,
          },
        ],
        authKey: "common-server",
      };
      await retry({
        async adapter() {
          try {
            const {
              data: { urls },
            } = await fetch(
              "https://workers.19981105.xyz/common/overseas2cdn",
              {
                method: "post",
                body: JSON.stringify(body),
              }
            ).then((res) => res.json());
            url = urls[0];
            return url.includes("fengniao");
          } catch {
            return false;
          }
        },
      });
      return url;
    } catch (error) {
      console.log("资源上传出错，使用默认资源", url, error);
      return url;
    }
  }

  async upload(url: string, type: ResourceType) {
    return limit(() => this.throttleUpload(url, type));
  }
  async uploadMedia(post: Post) {
    for (const resource of post.resources) {
      const isVideo = resource.type === "video";
      const url = await this.upload(resource.url, resource.type);
      resource.url = url;
      const thumbnail_url = await (isVideo && resource.thumbnail_url
        ? this.upload(resource.thumbnail_url, "image")
        : Promise.resolve(""));
      resource.thumbnail_url = thumbnail_url;
    }
  }
  async uploadMulMeidaToCdn(posts: Post[]) {
    try {
      const bar = this.multibar.create(posts.length, 0, {
        filename: "当前页传输进度",
      });
      let complete = 0;
      for (const post of posts) {
        await this.uploadMedia(post);
        complete++;
        console.log(
          `当前正在上传帖子(${post.insPostId})，总上传进度：${(
            (complete * 100) /
            posts.length
          ).toFixed(2)}%`
        );
        bar.increment();
      }
      bar.stop();
      return posts;
    } catch {
      this.multibar.stop();
      console.log(colors.yellow("上传出错"));
      return [];
    }
  }
}
