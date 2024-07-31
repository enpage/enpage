import z from "zod";

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

const youtubeVideoSchema = z.object({
  id: z.string().nanoid(),
  title: z.string(),
  publishedAt: z.string().optional(),
  thumbnail: z.string().url().optional(),
});

const youtubeFeedSchema = z.array(youtubeVideoSchema);

const tweetSchema = z.object({
  id: z.string().max(28),
  publishedAt: z.string(),
});

const twitterFeedSchema = z.array(tweetSchema);

export const providersSchemaMap: Record<DatasourceProvider, z.ZodTypeAny> = {
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

export type DatasourceHttpJsonProviderManifest<S extends z.ZodTypeAny> = {
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
  sampleData?: z.infer<S>;
};

export type DatasourceGenericManifest<S extends z.ZodTypeAny> = {
  provider?: never;
  name: string;
  description?: string;
  schema: S;
  refresh?: {
    method: "interval" | "manual";
    interval?: number;
  };
  sampleData?: z.infer<S>;
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
  S extends z.ZodTypeAny,
> = DatasourceProviderManifest<P> & {
  schema: S;
  data: z.infer<S>;
};

export type DatasourceGenericResolved<S extends z.ZodTypeAny> = DatasourceGenericManifest<S> & {
  data: z.infer<S>;
};

export type DatasourceResolved<D extends DatasourceManifestMap> = {
  [key in keyof D]: D[key]["provider"] extends DatasourceProvider
    ? DatasourceProviderResolved<D[key]["provider"], D[key]["schema"]>
    : DatasourceGenericResolved<D[key]["schema"]>;
};

export function defineDataSources(datasources: DatasourceManifestMap) {
  return datasources;
}
