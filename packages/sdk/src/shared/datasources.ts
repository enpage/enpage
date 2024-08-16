import { Type, type Static, type TSchema } from "@sinclair/typebox";
import type { DatasourceProvider } from "./datasources/types";
import { youtubeListSchema } from "./datasources/youtube/list/schema";
import { facebookPostSchema } from "./datasources/facebook/posts/schema";
import { instagramFeedSchema } from "./datasources/instagram/feed/schema";
import { mastodonStatusArraySchema } from "./datasources/mastodon/status/schema";
import { rssSchema } from "./datasources/rss/schema";
import { threadsMediaSchema } from "./datasources/threads/media/schema";
import { tiktokVideoResponseSchema } from "./datasources/tiktok/video/schema";

export { Type as ds, type TSchema } from "@sinclair/typebox";

export type DatasourceProviderOptions = TSchema;

export const providersSchemaMap: Record<DatasourceProvider, TSchema> = {
  "youtube-list": youtubeListSchema,
  "facebook-posts": facebookPostSchema,
  "instagram-feed": instagramFeedSchema,
  "mastodon-status": mastodonStatusArraySchema,
  "http-json": Type.Any(),
  rss: rssSchema,
  "threads-media": threadsMediaSchema,
  "tiktok-video": tiktokVideoResponseSchema,
};

type DatasourceProviderManifest<
  P extends DatasourceProvider,
  O extends DatasourceProviderOptions | null = null,
> = {
  provider: P;
  options?: O extends DatasourceProviderOptions ? Static<O> : never;
  name: string;
  description?: string;
  schema?: never;
  sampleData?: never;
  refresh?: {
    method: "interval" | "manual" | "live";
    interval?: number;
  };
};

export type DatasourceHttpJsonProviderManifest<S extends TSchema> = {
  provider: "http-json";
  name: string;
  description?: string;
  options: {
    url: string;
    headers?: Record<string, string>;
  };
  schema: S;
  refresh?: {
    method: "interval" | "manual" | "live";
    interval?: number;
  };
  sampleData?: Static<S>;
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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | DatasourceGenericManifest<any>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | DatasourceHttpJsonProviderManifest<any>
  | DatasourceProviderManifest<DatasourceProvider>
>;

// Full datasource definition
export type DatasourceProviderResolved<
  P extends DatasourceProvider,
  S extends TSchema,
> = DatasourceProviderManifest<P> & {
  schema: S;
  data: Static<S>;
};

export type DatasourceGenericResolved<S extends TSchema> = DatasourceGenericManifest<S> & {
  data: Static<S>;
};

export type DatasourceResolved<D extends DatasourceManifestMap> = {
  [key in keyof D]: D[key]["provider"] extends DatasourceProvider
    ? DatasourceProviderResolved<D[key]["provider"], D[key]["schema"]>
    : DatasourceGenericResolved<D[key]["schema"]>;
};

export function defineDataSources(datasources: DatasourceManifestMap) {
  return datasources;
}
