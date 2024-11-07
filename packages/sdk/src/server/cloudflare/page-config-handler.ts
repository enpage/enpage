import type { GenericPageConfig } from "../../shared/page";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";
import { kv } from "./cache";
import { getPageConfig } from "../common/get-page-config";

/**
 * Not usable in dev for now
 */
export default async function pageConfigHandler(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  const url = new URL(ctx.request.url);
  const cacheKey = `sites:${url.hostname}${url.pathname}`;
  // try to use the cache first, then fallback to the API
  const pageConfig = (await kv.getItem<GenericPageConfig>(cacheKey)) || (await getPageConfig(ctx));

  if (!pageConfig) {
    throw new Response("Not found.", { status: 404, headers: { "x-enpage-error": "Page config not Found" } });
  }

  if ("fromAPI" in pageConfig) {
    // cache the API response for 7 days
    ctx.waitUntil(
      kv.setItem(cacheKey, pageConfig, { expirationTtl: 3600 * 24 * 7 }).catch(() => {
        console.warn("Failed to cache page config");
      }),
    );
  }

  ctx.locals.pageConfig = pageConfig;
}
