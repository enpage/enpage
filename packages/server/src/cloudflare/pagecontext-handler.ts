import type { PageConfig } from "@enpage/sdk/page-config";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";
import { kv } from "./kv-cache";
import { getConfigFromAPI } from "~/shared/api";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GenericPageConfig = PageConfig<any, any>;

export default async function pageInfoHandler(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  const url = new URL(ctx.request.url);
  const cacheKey = `sites:${url.hostname}${url.pathname}`;
  // try to use the cache first, then fallback to the API
  const pageConfig = (await kv.getItem<GenericPageConfig>(cacheKey)) || (await getConfigFromAPI(ctx));

  if (!pageConfig) {
    throw new Response("Not found.", { status: 404 });
  }

  if ("fromAPI" in pageConfig) {
    // cache the API response for 7 days
    ctx.waitUntil(kv.setItem(cacheKey, pageConfig, { expirationTtl: 3600 * 24 * 7 }));
  }

  ctx.locals.pageConfig = pageConfig;
}
