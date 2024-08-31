import { sample as facebookListSample } from "./facebook/posts/sample";
import { sample as instagramFeedSample } from "./instagram/feed/sample";
import { sample as mastodonStatusSample } from "./mastodon/status/sample.array";
import { sample as rssSample } from "./rss/sample";
import { sample as threadsMediaSample } from "./threads/media/sample";
import { sample as tiktokVideoSample } from "./tiktok/video/sample";
import { sample as youtubeListSample } from "./youtube/list/sample";

export const samples = {
  "facebook-posts": facebookListSample,
  "instagram-feed": instagramFeedSample,
  "mastodon-status": mastodonStatusSample,
  rss: rssSample,
  "threads-media": threadsMediaSample,
  "tiktok-video": tiktokVideoSample,
  "youtube-list": youtubeListSample,
} as const;