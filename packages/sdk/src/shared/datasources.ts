import { Type, type Static, type TObject, type TSchema } from "@sinclair/typebox";
import { youtubeListSchema } from "./datasources/external/youtube/list/schema";
import { facebookPostSchema } from "./datasources/external/facebook/posts/schema";
import { instagramFeedSchema } from "./datasources/external/instagram/feed/schema";
import { mastodonStatusArraySchema } from "./datasources/external/mastodon/status/schema";
import { rssSchema } from "./datasources/external/rss/schema";
import { threadsMediaSchema } from "./datasources/external/threads/media/schema";
import { tiktokVideoResponseSchema } from "./datasources/external/tiktok/video/schema";
import { youtubeListOptions } from "./datasources/external/youtube/list/options";
import { metaOptions } from "./datasources/external/meta/options";
import { mastodonCommonOptions } from "./datasources/external/mastodon/options";
import { httpJsonOptions } from "./datasources/external/json/options";
import { rssOptions } from "./datasources/external/rss/options";
import { tiktokVideoOptions } from "./datasources/external/tiktok/video/options";
import type { GenericPageContext } from "./page";
import type { OAuthConfig } from "./datarecords/types";

export { Type as ds, type TSchema } from "@sinclair/typebox";

export const providerOptions = Type.Object({
  refreshInterval: Type.Optional(Type.Number()),
});

export type ProviderOptions = Static<typeof providerOptions>;

export const buildOAuthConfigSchema = <T extends TSchema>(T: T) =>
  Type.Object({
    siteId: Type.String(),
    siteDatasourceId: Type.String(),
    config: T,
    oauthTokenExpireAt: Type.String(),
    oauthRefreshTokenExpireAt: Type.Optional(Type.String()),
    nextRefreshTokenAt: Type.Optional(Type.String()),
  });

export type DatasourceFetcherParams<
  OAuthProps = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = {
  options: Opts;
  pageConfig: GenericPageContext;
  oauth: OAuthProps extends null ? null : OAuthConfig<OAuthProps>;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;

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

type HttpJsonSchema = TSchema;

const providersSchemaMap = Type.Object({
  "youtube-list": youtubeListSchema,
  "facebook-posts": facebookPostSchema,
  "instagram-feed": instagramFeedSchema,
  "mastodon-status": mastodonStatusArraySchema,
  json: Type.Union([
    Type.Array(Type.Object({}, { additionalProperties: true })),
    Type.Object({}, { additionalProperties: true }),
  ]),
  rss: rssSchema,
  "threads-media": threadsMediaSchema,
  "tiktok-video": tiktokVideoResponseSchema,
});

export type DatasourceProviderSchemaMap = Static<typeof providersSchemaMap>;

const providersOptionsMap = Type.Object({
  "youtube-list": youtubeListOptions,
  "facebook-posts": metaOptions,
  "instagram-feed": metaOptions,
  "mastodon-status": mastodonCommonOptions,
  json: httpJsonOptions,
  rss: rssOptions,
  "threads-media": metaOptions,
  "tiktok-video": tiktokVideoOptions,
});

export type DatasourceProviderOptionsMap = Static<typeof providersOptionsMap>;

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

export function defineDataSources<T extends DatasourcesMap>(datasources: T) {
  return datasources;
}
