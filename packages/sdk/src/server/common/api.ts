import type { GenericPageConfig } from "@enpage/sdk/page-config";
import type { RequestContext } from "@hattip/compose";
import type { ViteDevServer } from "vite";

export async function getConfigFromAPI(ctx: RequestContext) {
  // When in vite dev server, we can load the page config from a virtual module instead of the API
  if (ctx.locals.vite) {
    return ctx.locals.vite.ssrLoadModule("virtual:enpage-page-config.json") as Promise<GenericPageConfig>;
  }
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
  const resp = (await res.json()) as GenericPageConfig;
  return {
    ...resp,
    fromAPI: true,
  };
}
