import axios from "axios";
import fakeUa from "fake-useragent";
import type { ImginnPostsResponse } from "../types/response/imginn";
export interface ImginnParams {
  id: string;
  cursor: string;
  username: string;
  verified: number;
}
export async function imginnFetchPost(params: ImginnParams) {
  const url = axios.getUri({
    baseURL: "https://imginn.com/api/posts",
    params,
  });
  const res = await fetch(url, {
    headers: {
      accept: "*/*",
      "user-agent": fakeUa(),
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
  });
  const data = await (res.json() as Promise<ImginnPostsResponse>);
  return data;
}
