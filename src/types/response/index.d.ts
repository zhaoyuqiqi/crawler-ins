export interface InfoResponse {
  data: Data;
  extensions: Extensions;
  status: string;
}
interface Extensions {
  is_final: boolean;
  all_video_dash_prefetch_representations: Allvideodashprefetchrepresentation[];
  server_metadata: Servermetadata;
}
interface Servermetadata {
  request_start_time_ms: number;
  time_at_flush_ms: number;
}
interface Allvideodashprefetchrepresentation {
  video_id: string;
  representations: Representation[];
  initial_representation_ids: any[];
}
interface Representation {
  base_url: string;
  bandwidth: number;
  width: number;
  height: number;
  mime_type: string;
  codecs: string;
  playback_resolution_mos: string;
  playback_resolution_csvqm?: string;
  segments: Segment[];
  representation_id: string;
}
interface Segment {
  start: number;
  end: number;
}
interface Data {
  xdt_api__v1__feed__user_timeline_graphql_connection: Xdtapiv1feedusertimelinegraphqlconnection;
  xdt_viewer: Xdtviewer;
}
interface Xdtviewer {
  user: User3;
}
interface User3 {
  id: string;
}
interface Xdtapiv1feedusertimelinegraphqlconnection {
  edges: Edge[];
  page_info: Pageinfo;
}
interface Pageinfo {
  end_cursor: string;
  has_next_page: boolean;
  has_previous_page: boolean;
  start_cursor?: any;
}
interface Edge {
  node: Node;
  cursor: string;
}
interface Node {
  code: string;
  pk: string;
  id: string;
  ad_id?: any;
  boosted_status?: any;
  boost_unavailable_identifier?: any;
  boost_unavailable_reason?: any;
  caption?: Caption;
  caption_is_edited: boolean;
  feed_demotion_control?: any;
  feed_recs_demotion_control?: any;
  taken_at: number;
  inventory_source?: any;
  video_versions?: Videoversion[];
  is_dash_eligible?: number;
  number_of_qualities?: number;
  video_dash_manifest?: string;
  image_versions2: Imageversions2;
  sharing_friction_info: Sharingfrictioninfo;
  is_paid_partnership: boolean;
  sponsor_tags?: any;
  affiliate_info?: any;
  original_height: number;
  original_width: number;
  organic_tracking_token: string;
  link?: any;
  story_cta?: any;
  user: User;
  group?: any;
  owner: Owner;
  coauthor_producers: Coauthorproducer[];
  invited_coauthor_producers: any[];
  follow_hashtag_info?: any;
  title?: any;
  comment_count: number;
  comments_disabled?: any;
  commenting_disabled_for_viewer?: any;
  like_and_view_counts_disabled: boolean;
  has_liked: boolean;
  top_likers: any[];
  facepile_top_likers: any[];
  like_count: number;
  preview?: any;
  can_see_insights_as_brand: boolean;
  social_context?: any;
  view_count?: any;
  can_reshare?: any;
  can_viewer_reshare: boolean;
  ig_media_sharing_disabled: boolean;
  photo_of_you?: boolean;
  product_type: string;
  media_type: number;
  usertags?: Usertag;
  media_overlay_info?: any;
  carousel_parent_id?: any;
  carousel_media_count?: number;
  carousel_media?: Carouselmedia[];
  location?: Location;
  has_audio?: boolean;
  clips_metadata?: Clipsmetadatum;
  clips_attribution_info?: any;
  wearable_attribution_info?: any;
  accessibility_caption?: string;
  audience?: any;
  display_uri?: any;
  media_cropping_info?: Mediacroppinginfo;
  profile_grid_thumbnail_fitting_style: string;
  thumbnails?: any;
  timeline_pinned_user_ids: string[];
  upcoming_event?: any;
  logging_info_token?: any;
  explore?: any;
  main_feed_carousel_starting_media_id?: any;
  is_seen?: any;
  open_carousel_submission_state?: string;
  previous_submitter?: any;
  all_previous_submitters?: any[];
  headline?: any;
  comments?: any;
  hidden_likes_string_variant: number;
  fb_like_count?: number;
  crosspost_metadata: Crosspostmetadata;
  saved_collection_ids?: any;
  has_viewer_saved?: any;
  __typename: string;
}
interface Crosspostmetadata {
  is_feedback_aggregated?: boolean;
}
interface Mediacroppinginfo {
  square_crop?: Squarecrop;
  four_by_three_crop?: Squarecrop;
}
interface Squarecrop {
  crop_bottom: number;
  crop_left: number;
  crop_right: number;
  crop_top: number;
}
interface Clipsmetadatum {
  audio_type: string;
  achievements_info: Achievementsinfo;
  music_info?: Musicinfo;
  original_sound_info?: Originalsoundinfo;
  is_shared_to_fb: boolean;
}
interface Originalsoundinfo {
  original_audio_title: string;
  should_mute_audio: boolean;
  audio_asset_id: string;
  consumption_info: Consumptioninfo;
  ig_artist: Igartist;
  is_explicit: boolean;
}
interface Igartist {
  username: string;
  id: string;
}
interface Consumptioninfo {
  is_trending_in_clips: boolean;
  should_mute_audio_reason: string;
  should_mute_audio_reason_type?: any;
}
interface Musicinfo {
  music_consumption_info: Musicconsumptioninfo;
  music_asset_info: Musicassetinfo;
}
interface Musicassetinfo {
  audio_cluster_id: string;
  title: string;
  display_artist: string;
  is_explicit: boolean;
}
interface Musicconsumptioninfo {
  should_mute_audio: boolean;
  should_mute_audio_reason: string;
  is_trending_in_clips: boolean;
}
interface Achievementsinfo {
  show_achievements: boolean;
}
interface Location {
  pk: string;
  lat: number;
  lng: number;
  name: string;
  profile_pic_url?: any;
  __typename: string;
}
interface Carouselmedia {
  id: string;
  pk: string;
  accessibility_caption: string;
  is_dash_eligible?: any;
  video_dash_manifest?: any;
  media_type: number;
  original_height: number;
  original_width: number;
  inventory_source?: any;
  user?: any;
  usertags?: (Usertag | null)[];
  image_versions2: Imageversions2;
  carousel_parent_id: string;
  sharing_friction_info: Sharingfrictioninfo;
  preview?: any;
  organic_tracking_token?: any;
  saved_collection_ids?: any;
  has_viewer_saved?: any;
  video_versions?: any;
  media_overlay_info?: any;
  display_uri?: any;
  number_of_qualities?: any;
  taken_at: number;
  previous_submitter?: any;
  link?: any;
  story_cta?: any;
  has_liked?: any;
  like_count?: any;
  logging_info_token?: any;
  owner?: any;
}
interface Usertag {
  in: In[];
}
interface In {
  user: User2;
  position: number[];
}
interface User2 {
  pk: string;
  full_name: string;
  username: string;
  profile_pic_url: string;
  is_verified: boolean;
  id: string;
}
interface Coauthorproducer {
  pk: string;
  profile_pic_url: string;
  is_unpublished?: any;
  username: string;
  id: string;
  __typename: string;
  full_name: string;
  is_verified: boolean;
  friendship_status: Friendshipstatus2;
  supervision_info?: any;
}
interface Friendshipstatus2 {
  following: boolean;
  blocking: boolean;
  is_feed_favorite: boolean;
  outgoing_request: boolean;
  followed_by: boolean;
  incoming_request: boolean;
  is_restricted: boolean;
  is_bestie: boolean;
}
interface Owner {
  pk: string;
  profile_pic_url: string;
  username: string;
  friendship_status: Friendshipstatus;
  is_embeds_disabled: boolean;
  is_unpublished: boolean;
  is_verified: boolean;
  show_account_transparency_details: boolean;
  supervision_info?: any;
  transparency_product?: any;
  transparency_product_enabled: boolean;
  transparency_label?: any;
  ai_agent_owner_username?: any;
  id: string;
  __typename: string;
  is_private: boolean;
}
interface User {
  pk: string;
  username: string;
  profile_pic_url: string;
  is_private: boolean;
  is_embeds_disabled: boolean;
  is_unpublished: boolean;
  is_verified: boolean;
  friendship_status: Friendshipstatus;
  latest_besties_reel_media?: any;
  latest_reel_media: number;
  live_broadcast_visibility?: any;
  live_broadcast_id?: any;
  seen?: any;
  supervision_info?: any;
  id: string;
  hd_profile_pic_url_info: Hdprofilepicurlinfo;
  full_name: string;
  __typename: string;
}
interface Hdprofilepicurlinfo {
  url: string;
}
interface Friendshipstatus {
  following: boolean;
  is_bestie: boolean;
  is_feed_favorite: boolean;
  is_restricted: boolean;
}
interface Sharingfrictioninfo {
  bloks_app_url?: any;
  should_have_sharing_friction: boolean;
}
interface Imageversions2 {
  candidates: Candidate[];
}
interface Candidate {
  url: string;
  height: number;
  width: number;
}
interface Videoversion {
  width: number;
  height: number;
  url: string;
  type: number;
}
interface Caption {
  has_translation?: boolean;
  created_at: number;
  pk: string;
  text: string;
}