import type { PageConfig } from "../../shared/page-config";
import type { RequestContext } from "@hattip/compose";
import { fsCache, memoryCache } from "./cache";
import { getPageConfig } from "../common/get-page-config";
import type { NodePlatformInfo } from "@hattip/adapter-node";
import { getLocalPageConfig } from "./local-page-config";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GenericPageConfig = PageConfig<any, any>;

export default async function pageConfigHandler(ctx: RequestContext<NodePlatformInfo>) {
  const url = new URL(ctx.request.url);
  const cacheDriver = getCacheDriver();
  const cacheKey = `sites:${url.hostname}${url.pathname}`;

  let pageConfig: GenericPageConfig | null = null;

  // *Development*
  // When in vite dev server, we can load the page config from a virtual module instead of the API
  if (ctx.locals.vite) {
    pageConfig = (await ctx.locals.vite.ssrLoadModule("virtual:enpage-page-config.json"))
      .default as GenericPageConfig;
  } else {
    // *Production* or local production server testing
    if (process.env.NODE_ENV === "local-preview") {
      pageConfig = (await cacheDriver.getItem<GenericPageConfig>(cacheKey)) || (await getLocalPageConfig());
    } else {
      // try to use the cache first, then fallback to the API
      pageConfig = (await cacheDriver.getItem<GenericPageConfig>(cacheKey)) || (await getPageConfig(ctx));
    }
  }

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

function getCacheDriver() {
  return process.env.NODE_ENV === "development"
    ? memoryCache
    : process.env.CACHE_DRIVER === "fs"
      ? fsCache
      : memoryCache;
}
