
export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface InShowUserInfo {
  page_id: string;
  nickname: string;
  username: string;
  display_name: string;
  avatar_s3: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  link: string;
  about: string;
  website: string;
  verification: boolean;
  metadata: Metadata;
}
interface Metadata {
  followed: boolean;
  special_followed: boolean;
  remark: string;
  urged: boolean;
}

export interface InShowPostResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Result[];
}
interface Result {
  page: Page;
  page_id: string;
  media_id: string;
  media_create_time: string;
  media_type: 'video' | 'image' | 'sidecar';
  media_link: string;
  comments_count: number;
  like_count: number;
  caption: string;
  thumbnail_url_s3: string;
  attachments: string;
  metadata: Metadata2;
}
interface Metadata2 {
  collected: boolean;
  liked: boolean;
}
interface Page {
  page_id: string;
  nickname: string;
  username: string;
  display_name: string;
  avatar_s3: string;
  verification: boolean;
  metadata: Metadata;
}
interface Metadata {
  followed: boolean;
  special_followed: boolean;
  remark: string;
  urged: boolean;
}