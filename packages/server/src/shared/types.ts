import type { HattipHandler } from "@hattip/core";

export type EnpageEnv = {
  PUBLIC_ENPAGE_SITE_ID: string;
  PUBLIC_ENPAGE_API_BASE_URL: string;
  ENPAGE_API_TOKEN: string;
  SITES_DB: D1Database;
  SITES_R2_BUCKET: R2Bucket;
  SITES_CACHE: KVNamespace;
};

export type PageInfoHandler = HattipHandler;
