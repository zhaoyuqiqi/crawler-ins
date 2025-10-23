export interface ImginnPostsResponse {
  code: number;
  items: Item[];
  hasNext: boolean;
  cursor: string;
}
interface Item {
  id: string;
  owner?: Owner;
  likeCount: number;
  commentCount: number;
  isPind?: boolean;
  alt: string;
  isVideo?: boolean;
  thumb: string;
  time: string;
  src: string;
  code: string;
  srcs: string[];
  date: number;
  isSidecar?: boolean;
  accessibility?: any;
}
interface Owner {
  id: string;
  username: string;
}