export interface ResponseData {
  data: Data;
  status: string;
}
interface Data {
  user: User2;
}
export interface User2 {
  ai_agent_owner_username?: any;
  ai_agent_type?: any;
  biography: string;
  bio_links: Biolink[];
  fb_profile_biolink?: any;
  biography_with_entities: Biographywithentities;
  blocked_by_viewer: boolean;
  restricted_by_viewer?: any;
  country_block: boolean;
  eimu_id: string;
  external_url: string;
  external_url_linkshimmed: string;
  edge_followed_by: Edgefollowedby;
  fbid: string;
  followed_by_viewer: boolean;
  edge_follow: Edgefollowedby;
  follows_viewer: boolean;
  full_name: string;
  group_metadata?: any;
  has_ar_effects: boolean;
  has_clips: boolean;
  has_guides: boolean;
  has_channel: boolean;
  has_blocked_viewer: boolean;
  highlight_reel_count: number;
  has_onboarded_to_text_post_app: boolean;
  has_requested_viewer: boolean;
  hide_like_and_view_counts: boolean;
  id: string;
  is_business_account: boolean;
  is_professional_account: boolean;
  is_supervision_enabled: boolean;
  is_guardian_of_viewer: boolean;
  is_supervised_by_viewer: boolean;
  is_supervised_user: boolean;
  is_embeds_disabled: boolean;
  is_joined_recently: boolean;
  guardian_id?: any;
  business_address_json: string;
  business_contact_method: string;
  business_email?: any;
  business_phone_number?: any;
  business_category_name?: any;
  overall_category_name?: any;
  category_enum?: any;
  category_name?: any;
  is_private: boolean;
  is_verified: boolean;
  is_verified_by_mv4b: boolean;
  is_regulated_c18: boolean;
  edge_mutual_followed_by: Edgemutualfollowedby;
  pinned_channels_list_count: number;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  requested_by_viewer: boolean;
  should_show_category: boolean;
  should_show_public_contacts: boolean;
  show_account_transparency_details: boolean;
  show_text_post_app_badge?: any;
  remove_message_entrypoint: boolean;
  transparency_label?: any;
  transparency_product?: any;
  username: string;
  pronouns: any[];
  edge_owner_to_timeline_media: Edgeownertotimelinemedia;
  edge_saved_media: Edgesavedmedia;
  edge_media_collections: Edgesavedmedia;
  edge_related_profiles: Edgerelatedprofiles;
}
interface Edgerelatedprofiles {
  edges: Edge5[];
}
interface Edge5 {
  node: Node5;
}
interface Node5 {
  id: string;
  full_name: string;
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}
interface Edgesavedmedia {
  count: number;
  page_info: Pageinfo2;
  edges: any[];
}
interface Pageinfo2 {
  has_next_page: boolean;
  end_cursor?: any;
}
export interface Edgeownertotimelinemedia {
  count: number;
  page_info: Pageinfo;
  edges: Edge4[];
}
export interface Edge4 {
  node: Node4;
}
type TypeName = 'GraphSidecar' | 'GraphImage' | 'GraphVideo';
interface Node4 {
  __typename: TypeName
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  display_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  gating_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview?: string;
  owner: Owner;
  is_video: boolean;
  has_upcoming_event: boolean;
  accessibility_caption?: string;
  edge_media_to_caption: Edgemediatocaption;
  edge_media_to_comment: Edgefollowedby;
  comments_disabled: boolean;
  taken_at_timestamp: number;
  edge_liked_by: Edgefollowedby;
  edge_media_preview_like: Edgefollowedby;
  location?: Location;
  nft_asset_info?: any;
  thumbnail_src: string;
  thumbnail_tall_src: string;
  thumbnail_resources: Thumbnailresource[];
  tall_profile_grid_crop?: any;
  profile_grid_thumbnail_fitting_style: string;
  coauthor_producers: Coauthorproducer[];
  pinned_for_users: Coauthorproducer[];
  viewer_can_reshare: boolean;
  like_and_view_counts_disabled: boolean;
  edge_sidecar_to_children?: Edgesidecartochildren;
  dash_info?: Dashinfo;
  has_audio?: boolean;
  tracking_token?: string;
  video_url?: string;
  video_view_count?: number;
  felix_profile_grid_crop?: any;
  product_type?: string;
  clips_music_attribution_info?: Clipsmusicattributioninfo;
}
interface Clipsmusicattributioninfo {
  artist_name: string;
  song_name: string;
  uses_original_audio: boolean;
  should_mute_audio: boolean;
  should_mute_audio_reason: string;
  audio_id: string;
}
interface Edgesidecartochildren {
  edges: Edge3[];
}
interface Edge3 {
  node: Node3;
}
interface Node3 {
  __typename: TypeName;
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  display_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser2;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  gating_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview: string;
  owner: Owner;
  is_video: boolean;
  has_upcoming_event: boolean;
  accessibility_caption?: string | string;
  dash_info?: Dashinfo;
  has_audio?: boolean;
  tracking_token?: string;
  video_url?: string;
  video_view_count?: number;
}
interface Dashinfo {
  is_dash_eligible: boolean;
  video_dash_manifest: string;
  number_of_qualities: number;
}
interface Edgemediatotaggeduser2 {
  edges: Edge[][];
}
interface Coauthorproducer {
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}
interface Thumbnailresource {
  src: string;
  config_width: number;
  config_height: number;
}
interface Location {
  id: string;
  has_public_page: boolean;
  name: string;
  slug: string;
}
interface Edgemediatocaption {
  edges: Edge2[];
}
interface Edge2 {
  node: Node2;
}
interface Node2 {
  text: string;
}
interface Owner {
  id: string;
  username: string;
}
interface Sharingfrictioninfo {
  should_have_sharing_friction: boolean;
  bloks_app_url?: any;
}
interface Edgemediatotaggeduser {
  edges: Edge[];
}
interface Edge {
  node: Node;
}
interface Node {
  user: User;
  x: number;
  y: number;
}
interface User {
  full_name: string;
  followed_by_viewer: boolean;
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}
interface Dimensions {
  height: number;
  width: number;
}
interface Pageinfo {
  has_next_page: boolean;
  end_cursor: string;
}
interface Edgemutualfollowedby {
  count: number;
  edges: any[];
}
interface Edgefollowedby {
  count: number;
}
interface Biographywithentities {
  raw_text: string;
  entities: any[];
}
interface Biolink {
  title: string;
  lynx_url: string;
  url: string;
  link_type: string;
}
