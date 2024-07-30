import type { HattipHandler } from "@hattip/core";
import type { D1Database, R2Bucket, KVNamespace } from "@cloudflare/workers-types";

export type EnpageEnv = {
  PUBLIC_ENPAGE_SITE_ID: string;
  PUBLIC_ENPAGE_API_BASE_URL: string;
  ENPAGE_API_TOKEN: string;
  SITES_DB: D1Database;
  SITES_CACHE: KVNamespace;
  R2_SITES_BUCKET: R2Bucket;
  R2_SITES_BUCKET_NAME: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  NODE_ENV: "development" | "production" | "preview";
};

export type PageInfoHandler = HattipHandler;
