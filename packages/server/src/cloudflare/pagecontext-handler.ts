import type { PageContext } from "@enpage/sdk/context";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";

export default async function pageInfoHandler(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  const { pathname, hostname } = new URL(ctx.request.url);

  // Use D1 to get page info
  const db = ctx.platform.env;

  // 1. Get page info from API
  const apiUrl = ctx.env("ENPAGE_API_BASE_URL");
  const res = await fetch(`https://${apiUrl}/sites/${hostname}${pathname}`, {
    headers: {
      Authorization: `Bearer ${ctx.env("PRIVATE_ENPAGE_API_TOKEN")}`,
    },
    cf: {
      cacheEverything: true,
    },
  });

  if (!res.ok) {
    throw new Response("Not found.", { status: 404 });
  }

  // biome-ignore lint/suspicious/noExplicitAny: we don't know the shape of the page context yet
  const pageContext = (await res.json()) as PageContext<any, any>;

  ctx.locals.pageContext = pageContext;
}
