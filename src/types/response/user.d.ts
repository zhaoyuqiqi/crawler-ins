export interface UserData {
  data: Data;
  extensions: Extensions;
  status: string;
}
interface Extensions {
  is_final: boolean;
  server_metadata: Servermetadata;
}
interface Servermetadata {
  request_start_time_ms: number;
  time_at_flush_ms: number;
}
interface Data {
  user: User;
  viewer: Viewer;
}
interface Viewer {
  user: User2;
}
interface User2 {
  pk: string;
  id: string;
  can_see_organic_insights: boolean;
}
interface User {
  friendship_status: Friendshipstatus;
  gating?: any;
  is_memorialized: boolean;
  is_private: boolean;
  has_story_archive?: any;
  supervision_info?: any;
  is_regulated_c18: boolean;
  regulated_news_in_locations: any[];
  bio_links: Biolink[];
  linked_fb_info?: any;
  text_post_app_badge_label?: any;
  show_text_post_app_badge?: any;
  username: string;
  text_post_new_post_count?: any;
  pk: string;
  live_broadcast_visibility?: any;
  live_broadcast_id?: any;
  profile_pic_url: string;
  hd_profile_pic_url_info: Hdprofilepicurlinfo;
  is_unpublished: boolean;
  latest_reel_media: number;
  has_profile_pic?: any;
  profile_pic_genai_tool_info: any[];
  biography: string;
  full_name: string;
  is_verified: boolean;
  show_account_transparency_details: boolean;
  account_type: number;
  follower_count: number;
  mutual_followers_count: number;
  profile_context_links_with_user_ids: Profilecontextlinkswithuserid[];
  address_street: string;
  city_name: string;
  is_business: boolean;
  zip: string;
  biography_with_entities: Biographywithentities;
  category: string;
  should_show_category: boolean;
  account_badges: any[];
  ai_agent_type?: any;
  external_lynx_url: string;
  external_url: string;
  pronouns: any[];
  transparency_label?: any;
  transparency_product?: any;
  has_chaining: boolean;
  remove_message_entrypoint: boolean;
  fbid_v2: string;
  is_embeds_disabled: boolean;
  is_professional_account?: any;
  following_count: number;
  media_count: number;
  total_clips_count: number;
  latest_besties_reel_media: number;
  reel_media_seen_timestamp?: any;
  id: string;
}
interface Biographywithentities {
  entities: any[];
}
interface Profilecontextlinkswithuserid {
  username: string;
  id?: any;
}
interface Hdprofilepicurlinfo {
  url: string;
}
interface Biolink {
  image_url: string;
  is_pinned: boolean;
  link_type: string;
  lynx_url: string;
  media_type: string;
  title: string;
  url: string;
  creation_source: string;
}
interface Friendshipstatus {
  following: boolean;
  blocking: boolean;
  is_feed_favorite: boolean;
  outgoing_request: boolean;
  followed_by: boolean;
  incoming_request: boolean;
  is_restricted: boolean;
  is_bestie: boolean;
  muting: boolean;
  is_muting_reel: boolean;
}