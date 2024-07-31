import type { GenericPageConfig } from "@enpage/sdk/page-config";
import type { RequestContext } from "@hattip/compose";

export async function getPageConfigFromAPI(ctx: RequestContext) {
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
