import { Type, type Static } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { metaOptions } from "./external/meta/options";
import { mastodonCommonOptions } from "./external/mastodon/options";
import { httpJsonOptions } from "./external/json/options";
import { rssOptions } from "./external/rss/options";
import { tiktokVideoOptions } from "./external/tiktok/video/options";
import { faqSchema } from "./internal/faq/schema";
import { linksSchema } from "./internal/links/schema";
import { contactInfoSchema } from "./internal/contact-info/schema";
import { blogSchema } from "./internal/blog/schema";
import { changelogSchema } from "./internal/changelog/schema";
import { recipesSchema } from "./internal/recipes/schema";

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
  }),
  Type.Object({
    provider: Type.Literal("facebook-posts"),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("instragram-feed"),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("threads-media"),
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
  Type.Object({
    provider: Type.Literal("internal-blog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: blogSchema,
  }),
  Type.Object({
    provider: Type.Literal("internal-changelog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: changelogSchema,
  }),
  Type.Object({
    provider: Type.Literal("internal-contact-info"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: contactInfoSchema,
  }),
  Type.Object({
    provider: Type.Literal("internal-faq"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: faqSchema,
  }),
  Type.Object({
    provider: Type.Literal("internal-links"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: linksSchema,
  }),
  Type.Object({
    provider: Type.Literal("internal-recipes"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: recipesSchema,
  }),
]);

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  Type.Object({
    name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
    description: Type.Optional(Type.String({ title: "Description of the datasource" })),
    sampleData: Type.Optional(Type.Any()),
    ttlMinutes: Type.Optional(
      Type.Number({
        title: "Time to live",
        description:
          "Time to live in minutes. If set to -1, it never expires and has to be manually refreshed. If set to 0, the datasource is always fetched live. If > 0, then the datasource is feteched every N minutes.",
      }),
    ),
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

const datasourceCustomManifest = Type.Object({
  provider: Type.Literal("custom", {
    title: "Custom",
    description: "Custom datasource saved locally in Upstart.",
  }),
  options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  schema: Type.Union([
    Type.Array(Type.Object({}, { additionalProperties: true })),
    Type.Object({}, { additionalProperties: true }),
  ]),
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceCustomManifest = Static<typeof datasourceCustomManifest>;

export const datasourcesMap = Type.Record(
  Type.String(),
  Type.Union([datasourceCustomManifest, datasourceProviderManifest]),
  { title: "Datasources map", description: "The map of datasources available in the system" },
);

export type DatasourcesMap = Static<typeof datasourcesMap>;

export type DatasourcesResolved<T extends DatasourcesMap = DatasourcesMap> = {
  [K in keyof T]: unknown;
};
