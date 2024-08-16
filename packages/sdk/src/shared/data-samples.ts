import type { providersSchemaMap } from "./datasources";
import type { Static } from "@sinclair/typebox";
import type { DatasourceProvider } from "./datasources/types";

export const providersSamples: Record<DatasourceProvider, unknown> = {
  "youtube-list": [
    {
      id: "dQw4w9WgXcQ",
      publishedAt: "2009-10-25",
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    },
    {
      id: "6YzGOq42zLk",
      publishedAt: "2011-11-15",
      title: 'Gotye performing "Somebody That I Used To Know" Live on KCRW',
    },
    {
      id: "RBumgq5yVrA",
      publishedAt: "2012-07-26",
      title: "Passenger | Let Her Go (Official Video)",
    },
  ] as Static<(typeof providersSchemaMap)["youtube-list"]>,
  "facebook-posts": [
    {
      id: "123456789",
      message: "Hello, world!",
      createdTime: "2021-09-01T12:34:56Z",
    },
    {
      id: "987654321",
      message: "Goodbye, world!",
      createdTime: "2021-09-02T12:34:56Z",
    },
  ] as Static<(typeof providersSchemaMap)["facebook-posts"]>,
  "instagram-feed": [
    {
      id: "123456789",
      caption: "Hello, world!",
      timestamp: "2021-09-01T12:34:56Z",
    },
    {
      id: "987654321",
      caption: "Goodbye, world!",
      timestamp: "2021-09-02T12:34:56Z",
    },
  ] as Static<(typeof providersSchemaMap)["instagram-feed"]>,
  "http-json": {
    id: 1,
    title: "Hello, world!",
  } as Static<(typeof providersSchemaMap)["http-json"]>,
  rss: {
    id: "123456789",
    title: "Hello, world!",
    published: "2021-09-01T12:34:56Z",
  } as Static<(typeof providersSchemaMap)["rss"]>,
  "mastodon-status": [
    {
      id: "123456789",
      content: "Hello, world!",
      created_at: "2021-09-01T12:34:56Z",
    },
    {
      id: "987654321",
      content: "Goodbye, world!",
      created_at: "2021-09-02T12:34:56Z",
    },
  ] as Static<(typeof providersSchemaMap)["mastodon-status"]>,
  "threads-media": {
    id: "123456789",
    title: "Hello, world!",
    published: "2021-09-01T12:34:56Z",
  } as Static<(typeof providersSchemaMap)["threads-media"]>,
  "tiktok-video": {
    id: "123456789",
    title: "Hello, world!",
    video_description: "This is a video description.",
    duration: 123,
    cover_image_url: "https://example.com/cover.jpg",
    embed_link: "https://example.com/embed",
  } as Static<(typeof providersSchemaMap)["tiktok-video"]>,
};
