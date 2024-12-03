import { Type, type Static, type TObject, type TSchema } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { youtubeListSchema } from "./external/youtube/list/schema";
import { metaOptions } from "./external/meta/options";
import { mastodonCommonOptions } from "./external/mastodon/options";
import { mastodonStatusArraySchema } from "./external/mastodon/status/schema";
import { facebookPostSchema } from "./external/facebook/posts/schema";
import { instagramFeedSchema } from "./external/instagram/feed/schema";
import { threadsMediaSchema } from "./external/threads/media/schema";
import { tiktokVideoResponseSchema } from "./external/tiktok/video/schema";
import { httpJsonOptions } from "./external/json/options";
import { rssOptions } from "./external/rss/options";
import { rssSchema } from "./external/rss/schema";
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

const providersChoices = Type.Union([
  Type.Object({
    provider: Type.Literal("youtube-list"),
    options: youtubeListOptions,
    // schema: youtubeListSchema,
  }),
  Type.Object({
    provider: Type.Literal("facebook-posts"),
    options: metaOptions,
    // schema: facebookPostSchema,
  }),
  Type.Object({
    provider: Type.Literal("instragram-feed"),
    options: metaOptions,
    // schema: instagramFeedSchema,
  }),
  Type.Object({
    provider: Type.Literal("threads-media"),
    options: metaOptions,
    // schema: threadsMediaSchema,
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status"),
    options: mastodonCommonOptions,
    // schema: mastodonStatusArraySchema,
  }),
  Type.Object({
    provider: Type.Literal("rss"),
    options: rssOptions,
    // schema: rssSchema,
  }),
  Type.Object({
    provider: Type.Literal("tiktok-video"),
    options: tiktokVideoOptions,
    // schema: tiktokVideoResponseSchema,
  }),
  Type.Object({
    provider: Type.Literal("json"),
    options: httpJsonOptions,
    schema: Type.Union([
      Type.Array(Type.Object({}, { additionalProperties: true })),
      Type.Object({}, { additionalProperties: true }),
    ]),
  }),
  Type.Object({
    provider: Type.Literal("generic"),
    options: Type.Any(),
    schema: Type.Union([
      Type.Array(Type.Object({}, { additionalProperties: true })),
      Type.Object({}, { additionalProperties: true }),
    ]),
  }),
]);

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  Type.Object({
    name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
    description: Type.Optional(Type.String({ title: "Description of the datasource" })),
    sampleData: Type.Optional(Type.Any()),
    refresh: Type.Optional(
      Type.Object(
        {
          method: Type.Union([Type.Literal("interval"), Type.Literal("manual"), Type.Literal("live")]),
          interval: Type.Optional(Type.Number()),
        },
        {
          title: "Refresh options",
          description: "Options to refresh the datasource",
        },
      ),
    ),
  }),
]);

export type DatasourceProviderManifest = Static<typeof datasourceProviderManifest>;

const datasourceGenericManifest = Type.Object({
  provider: Type.Literal("generic", {
    title: "Generic",
    description: "Generic datasource is saved locally in Upstart.",
  }),
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  schema: Type.Any({}),
  refresh: Type.Optional(
    Type.Object(
      {
        method: Type.Union([Type.Literal("interval"), Type.Literal("manual")]),
        interval: Type.Optional(Type.Number()),
      },
      {
        title: "Refresh options",
        description: "Options to refresh the datasource",
      },
    ),
  ),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceGenericManifest = Static<typeof datasourceGenericManifest>;

export const datasourcesMap = Type.Record(
  Type.String(),
  Type.Union([datasourceGenericManifest, datasourceProviderManifest]),
  { title: "Datasources map", description: "The map of datasources available in the system" },
);

export type DatasourcesMap = Static<typeof datasourcesMap>;

export type DatasourcesResolved<T extends DatasourcesMap> = {
  [K in keyof T]: unknown;
};
