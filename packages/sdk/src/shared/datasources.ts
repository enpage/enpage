import { Type, type Static, type TSchema } from "@sinclair/typebox";
import type { DatasourceProvider } from "./datasources/types";
import { youtubeListSchema } from "./datasources/youtube/list/schema";
import { facebookPostSchema } from "./datasources/facebook/posts/schema";
import { instagramFeedSchema } from "./datasources/instagram/feed/schema";
import { mastodonStatusArraySchema } from "./datasources/mastodon/status/schema";
import { rssSchema } from "./datasources/rss/schema";
import { threadsMediaSchema } from "./datasources/threads/media/schema";
import { tiktokVideoResponseSchema } from "./datasources/tiktok/video/schema";
import { youtubeListOptions } from "./datasources/youtube/list/options";
import { metaOptions } from "./datasources/meta/options";
import { mastodonCommonOptions } from "./datasources/mastodon/options";
import { httpJsonOptions } from "./datasources/http/json/options";
import { rssOptions } from "./datasources/rss/options";
import { tiktokVideoOptions } from "./datasources/tiktok/video/options";

export { Type as ds, type TSchema } from "@sinclair/typebox";

type HttpJsonSchema = TSchema;

export const providersSchemaMap: Record<DatasourceProvider, TSchema> = {
  "youtube-list": youtubeListSchema,
  "facebook-posts": facebookPostSchema,
  "instagram-feed": instagramFeedSchema,
  "mastodon-status": mastodonStatusArraySchema,
  "http-json": Type.Union([
    Type.Array(Type.Any()),
    Type.Object({}, { additionalProperties: true }),
  ]) as HttpJsonSchema,
  rss: rssSchema,
  "threads-media": threadsMediaSchema,
  "tiktok-video": tiktokVideoResponseSchema,
};

export type DatasourceProviderSchemaMap = {
  [key in DatasourceProvider]: Static<(typeof providersSchemaMap)[key]>;
};

export const providersOptionsMap: Record<DatasourceProvider, TSchema> = {
  "youtube-list": youtubeListOptions,
  "facebook-posts": metaOptions,
  "instagram-feed": metaOptions,
  "mastodon-status": mastodonCommonOptions,
  "http-json": httpJsonOptions,
  rss: rssOptions,
  "threads-media": metaOptions,
  "tiktok-video": tiktokVideoOptions,
};

export type DatasourceProviderOptionsMap = {
  [key in DatasourceProvider]: Static<(typeof providersOptionsMap)[key]>;
};

export type DatasourceProviderManifest<
  P extends DatasourceProvider,
  O extends DatasourceProviderOptionsMap[P] = DatasourceProviderOptionsMap[P],
  S extends TSchema = P extends "http-json" ? HttpJsonSchema : (typeof providersSchemaMap)[P],
> = {
  provider: P;
  options: O;
  name: string;
  description?: string;
} & (P extends "http-json"
  ? {
      schema: S;
      sampleData?: Static<S>;
    }
  : {
      schema?: never;
      sampleData?: Static<S>;
    }) & {
    refresh?: {
      method: "interval" | "manual" | "live";
      interval?: number;
    };
  };

export type DatasourceGenericManifest<S extends TSchema> = {
  provider?: never;
  name: string;
  description?: string;
  schema: S;
  refresh?: {
    method: "interval" | "manual";
    interval?: number;
  };
  sampleData?: Static<S>;
};

export type DatasourceManifestMap = Record<
  string,
  | DatasourceGenericManifest<TSchema>
  | {
      [P in DatasourceProvider]: DatasourceProviderManifest<P>;
    }[DatasourceProvider]
>;

// Helper type to ensure the correct structure of datasources
type EnsureDatasourceManifestMap<T> = T extends DatasourceManifestMap ? T : never;

type IsProvider<T> = T extends { provider: DatasourceProvider } ? T : never;

export type DatasourceResolved<D extends DatasourceManifestMap> = {
  [K in keyof D]: IsProvider<D[K]> extends never
    ? D[K] extends DatasourceGenericManifest<infer S>
      ? DatasourceGenericManifest<S> & { data: Static<S> }
      : never
    : D[K] extends DatasourceProviderManifest<infer P, infer O, infer S>
      ? P extends DatasourceProvider
        ? DatasourceProviderManifest<P, O, S> & {
            data: P extends "http-json" ? Static<S> : Static<(typeof providersSchemaMap)[P]>;
          }
        : never
      : never;
};
export function defineDataSources<T extends DatasourceManifestMap>(datasources: T) {
  return datasources as EnsureDatasourceManifestMap<T>;
}
