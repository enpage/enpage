import type { PageConfig } from "@enpage/sdk/page-config";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";
import { cache } from "./cache";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GenericPageConfig = PageConfig<any, any>;

export default async function pageInfoHandler(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  let pageConfig: GenericPageConfig | null = null;

  // try to use the cache first
  pageConfig = (await cache.getItem<GenericPageConfig>("sites")) || (await getConfigFromAPI(ctx));

  // Get page info from API
  if (!pageConfig) {
    throw new Response("Not found.", { status: 404 });
  }

  ctx.locals.pageConfig = pageConfig;
}

async function getConfigFromAPI(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  const url = new URL(ctx.request.url);
  const apiUrl = ctx.env("ENPAGE_API_BASE_URL");
  const res = await fetch(`https://${apiUrl}/sites/${url.hostname}${url.pathname}`, {
    headers: {
      Authorization: `Bearer ${ctx.env("ENPAGE_API_TOKEN")}`,
    },
    cf: {
      cacheEverything: true,
    },
  });
  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<GenericPageConfig>;
}
