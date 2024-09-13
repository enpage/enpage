import type { TSchema, Static } from "@sinclair/typebox";
import { sample as facebookListSample } from "./external/facebook/posts/sample";
import { sample as instagramFeedSample } from "./external/instagram/feed/sample";
import { sample as mastodonStatusSample } from "./external/mastodon/status/sample.array";
import { sample as rssSample } from "./external/rss/sample";
import { sample as threadsMediaSample } from "./external/threads/media/sample";
import { sample as tiktokVideoSample } from "./external/tiktok/video/sample";
import type { DatasourceProvider } from "./types";
import { sample as youtubeListSample } from "./external/youtube/list/sample";

export const samples: Record<Exclude<DatasourceProvider, "json">, Static<TSchema>> = {
  "facebook-posts": facebookListSample,
  "instagram-feed": instagramFeedSample,
  "mastodon-status": mastodonStatusSample,
  rss: rssSample,
  "threads-media": threadsMediaSample,
  "tiktok-video": tiktokVideoSample,
  "youtube-list": youtubeListSample,
} as const;
