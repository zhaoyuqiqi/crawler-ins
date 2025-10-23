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
      HOST: "imginn.com",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
    },
  });
  console.log('-----------------', await res.text());
  const data = await (res.json() as Promise<ImginnPostsResponse>);
  return data;
}
