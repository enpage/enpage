import type { HattipHandler } from "@hattip/core";

export type EnpageEnv = {
  ENPAGE_SITE_ID: string;
  ENPAGE_API_BASE_URL: string;
  PRIVATE_ENPAGE_API_TOKEN: string;
  SITES_DB: D1Database;
};

export type PageInfoHandler = HattipHandler;
