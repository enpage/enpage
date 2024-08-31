import invariant from "~/shared/utils/invariant";
import type { GenericPageConfig } from "../../shared/page-config";
import type { RequestContext } from "@hattip/compose";

export async function getPageConfig(ctx: RequestContext) {
  const url = new URL(ctx.request.url);

  const apiUrl = ctx.env("PUBLIC_ENPAGE_API_BASE_URL");
  invariant(apiUrl, "PUBLIC_ENPAGE_API_BASE_URL is not set");

  const token = ctx.env("ENPAGE_API_TOKEN");
  invariant(token, "ENPAGE_API_TOKEN is not set");

  const res = await fetch(`${apiUrl}/v1/sites/${url.hostname}${url.pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
