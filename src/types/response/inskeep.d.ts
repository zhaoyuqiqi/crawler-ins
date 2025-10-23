export interface BaseResponse<T> {
  errcode: number;
  errmsg: string;
  data: T;
}
interface LoginInfo {
  id: number;
  user_id: number;
  openid: string;
  unionid: string;
  nickname: string;
  headimgurl: string;
}

export interface LoginData {
  info: LoginInfo;
  isCreated: boolean;
  overdue: string;
  token: string;
  userId: number;
  userType: number;
}

interface UserItem {
  tag_id: number;
  user_id: string;
  full_name: string;
  username: string;
  followers: number;
  category_name: string;
  avatar: string;
  edge_followed_by_count: number;
  static_profile_pic_url_hd: string;
}

export interface UserList {
  list: UserItem[];
  total: number;
  offset: number;
}


export interface InskeepwPostResponse {
  data: InskeepPost[];
  offset: number;
}
export interface InskeepPost {
  id: string;
  userId: string;
  content: string;
  userName: string;
  userImage: string;
  mainImage: string;
  likeCount: number;
  mediaCount: number;
  commentCount: number;
  isVideo: boolean;
  takeAt: number;
  sources?: Source[];
  isBookmarked: boolean;
  isFollowed: boolean;
  isLiked: boolean;
}
export interface Source {
  type: string;
  url: string;
  thumbnailUrl: string;
  id: number;
}

export interface UserInfo {
  userId: string;
  userName: string;
  userImage: string;
  followers: number;
  following: number;
  userSign: string;
  categoryName: string;
  mediaCount: number;
  isFollow: boolean;
}

interface InskeepSearchItem {
  tag_id: number;
  user_id: string;
  full_name: string;
  username: string;
  followers: number;
  category_name: string;
  avatar: string;
  edge_followed_by_count: number;
  static_profile_pic_url_hd: string;
}

export interface InskeepSearchData {
  list: InskeepSearchItem[];
}
