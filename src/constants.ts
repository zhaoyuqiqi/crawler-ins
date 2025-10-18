import { Token } from "./utils/dynamic-token";

export const INSHOW_MEDIA_HOST = "https://icdn.inshowapp.cn/";

export const MONGODB_CONFIG = {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
  host: process.env.MONGODB_HOST,
  port: Number(process.env.MONGODB_PORT),
};

console.log("MONGODB_CONFIG", MONGODB_CONFIG);

export const JWTTokens: Token[] = JSON.parse(process.env.JWT_TOKENS || "[]");
console.log("JWTTokens", JWTTokens);

// inskeep category id
export type InskeepCartegory = number;
export type InshowCartegory = number;
//  通过inskeep的分类id获取inshow的分类id
export const categoryMap = new Map<InskeepCartegory, InshowCartegory>();

categoryMap.set(2, 3); // 内地
categoryMap.set(3, 4); // 港台
categoryMap.set(4, 5); // 韩国
categoryMap.set(5, 6); // 日本
categoryMap.set(6, 7); // 泰国
categoryMap.set(7, 8); // 欧美
categoryMap.set(8, 19); // 穿搭
categoryMap.set(9, 9); // 体育
categoryMap.set(10, 18); // 品牌
