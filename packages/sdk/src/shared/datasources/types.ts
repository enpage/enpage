import { Type, type Static, type TObject, type TSchema } from "@sinclair/typebox";
// import { youtubeListSchema } from "./external/youtube/list/schema";
// import { facebookPostSchema } from "./external/facebook/posts/schema";
// import { instagramFeedSchema } from "./external/instagram/feed/schema";
// import { mastodonStatusArraySchema } from "./external/mastodon/status/schema";
// import { rssSchema } from "./external/rss/schema";
// import { threadsMediaSchema } from "./external/threads/media/schema";
// import { tiktokVideoResponseSchema } from "./external/tiktok/video/schema";
import { youtubeListOptions } from "./external/youtube/list/options";
import { metaOptions } from "./external/meta/options";
import { mastodonCommonOptions } from "./external/mastodon/options";
import { httpJsonOptions } from "./external/json/options";
import { rssOptions } from "./external/rss/options";
import { tiktokVideoOptions } from "./external/tiktok/video/options";

export const providersSchema = Type.Union([
  Type.Literal("facebook-posts"),
  Type.Literal("instagram-feed"),
  Type.Literal("mastodon-status"),
  Type.Literal("rss"),
  Type.Literal("threads-media"),
  Type.Literal("tiktok-video"),
  Type.Literal("youtube-list"),
  Type.Literal("json"),
]);

export type DatasourceProvider = Static<typeof providersSchema>;

export const providerOptions = Type.Object({
  refreshInterval: Type.Optional(Type.Number()),
});

export type ProviderOptions = Static<typeof providerOptions>;

const providersChoices = Type.Union([
  Type.Object({
    provider: Type.Literal("youtube-list"),
    options: youtubeListOptions,
  }),
  Type.Object({
    provider: Type.Union([
      Type.Literal("facebook-posts"),
      Type.Literal("instagram-feed"),
      Type.Literal("threads-media"),
    ]),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status"),
    options: mastodonCommonOptions,
  }),
  Type.Object({
    provider: Type.Literal("rss"),
    options: rssOptions,
  }),
  Type.Object({
    provider: Type.Literal("tiktok-video"),
    options: tiktokVideoOptions,
  }),
  Type.Object({
    provider: Type.Literal("json"),
    options: httpJsonOptions,
    schema: Type.Union([
      Type.Array(Type.Object({}, { additionalProperties: true })),
      Type.Object({}, { additionalProperties: true }),
    ]),
  }),
]);

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    sampleData: Type.Optional(Type.Any()),
    refresh: Type.Optional(
      Type.Object({
        method: Type.Union([Type.Literal("interval"), Type.Literal("manual"), Type.Literal("live")]),
        interval: Type.Optional(Type.Number()),
      }),
    ),
  }),
]);

export type DatasourceProviderManifest = Static<typeof datasourceProviderManifest>;

const datasourceGenericManifest = Type.Object({
  provider: Type.Literal("generic"),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  schema: Type.Object({}, { additionalProperties: true }),
  refresh: Type.Optional(
    Type.Object({
      method: Type.Union([Type.Literal("interval"), Type.Literal("manual")]),
      interval: Type.Optional(Type.Number()),
    }),
  ),
  sampleData: Type.Optional(Type.Any()),
});

export type DatasourceGenericManifest = Static<typeof datasourceGenericManifest>;

export const datasourcesMap = Type.Record(
  Type.String(),
  Type.Union([datasourceGenericManifest, datasourceProviderManifest]),
);

export type DatasourcesMap = Static<typeof datasourcesMap>;

export type DatasourcesResolved<T extends DatasourcesMap> = {
  data: T["schema"];
};
