import type { PageConfig } from "@enpage/sdk/page-config";
import type { RequestContext } from "@hattip/compose";
import { fsCache, memoryCache } from "./cache";
import { getConfigFromAPI } from "../common/api";
import type { NodePlatformInfo } from "@hattip/adapter-node";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GenericPageConfig = PageConfig<any, any>;

export default async function pageConfigHandler(ctx: RequestContext<NodePlatformInfo>) {
  const url = new URL(ctx.request.url);
  const cacheDriver = process.env.CACHE_DRIVER === "fs" ? fsCache : memoryCache;
  const cacheKey = `sites:${url.hostname}${url.pathname}`;
  // try to use the cache first, then fallback to the API
  const pageConfig =
    (await cacheDriver.getItem<GenericPageConfig>(cacheKey)) || (await getConfigFromAPI(ctx));

  if (!pageConfig) {
    throw new Response("Not found.", {
      status: 404,
      headers: { "x-enpage-error": "Page config not Found" },
    });
  }

  if ("fromAPI" in pageConfig) {
    // cache the API response for 7 days
    ctx.waitUntil(cacheDriver.setItem(cacheKey, pageConfig, { expirationTtl: 3600 * 24 * 7 }));
  }

  ctx.locals.pageConfig = pageConfig;
}
