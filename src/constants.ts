import { Token } from './utils/dynamic-token';

export const INSHOW_MEDIA_HOST = 'https://icdn.inshowapp.cn/';

export const MONGODB_CONFIG = {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
  host: process.env.MONGODB_HOST,
  port: Number(process.env.MONGODB_PORT)
};

export const JWTTokens: Token[] = JSON.parse(process.env.JWT_TOKENS || '[]')
