import type z from "zod";
import { Type, type Static, type TSchema } from "@sinclair/typebox";

export type DatasourceProvider = "youtube-video" | "youtube-feed" | "tweet" | "twitter-feed";
// | "instagram"
// | "linkedin"
// | "facebook"
// | "google"
// | "spotify"
// | "tiktok"
// | "github"
// | "reddit"
// | "snapchat"
// | "pinterest"
// | "twitch";

const youtubeVideoSchema = Type.Object({
  id: Type.String({ minLength: 1 }),
  title: Type.String(),
  publishedAt: Type.String(),
  thumbnail: Type.Optional(Type.String()),
});

const youtubeFeedSchema = Type.Array(youtubeVideoSchema);

const tweetSchema = Type.Object({
  id: Type.String({ maxLength: 36 }),
  publishedAt: Type.String(),
});

const twitterFeedSchema = Type.Array(tweetSchema);

export const providersSchemaMap: Record<DatasourceProvider, TSchema> = {
  "youtube-video": youtubeVideoSchema,
  "youtube-feed": youtubeFeedSchema,
  tweet: tweetSchema,
  "twitter-feed": twitterFeedSchema,
};

type DatasourceProviderManifest<P extends DatasourceProvider> = {
  provider: P;
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
  url: string;
  headers?: Record<string, string>;
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
