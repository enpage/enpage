import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { NodePlatformInfo } from "@hattip/adapter-node";
import type { RequestContext } from "@hattip/compose";
import type { EnpageEnv } from "~/shared/types";
import type { GenericPageContext } from "@enpage/sdk/page-context";
import type { DatasourceGenericResolved } from "@enpage/sdk/datasources";
import { MAX_LIVE_DATASOURCES } from "./constants";

export default async function renderHandler(
  ctx: RequestContext<CloudflareWorkersPlatformInfo | NodePlatformInfo>,
) {
  // At this point we should have access to ctx.locals.pageContext
  // If not, this is an internal error
  if (!ctx.locals.pageConfig) {
    throw new Response("Page config not found.", { status: 500 });
  }

  const isCF = isCloudflare(ctx);
  const env = isCF ? (ctx.platform.env as EnpageEnv) : (process.env as unknown as EnpageEnv);
  const url = new URL(ctx.request.url);
  const isProduction = process.env.NODE_ENV === "production";

  // If in production, we should have the SSR manifest
  if (isProduction && !ctx.locals.pageConfig.ssrManifest) {
    throw new Response("SSR manifest not found.", { status: 500 });
  }

  const pageContext = {
    // take attributes from the page config
    attributes: ctx.locals.pageConfig.attributes,
    // take data from the page config
    data: ctx.locals.pageConfig.data ?? {},
  } satisfies GenericPageContext;

  // loop through the datasources and fetch data
  // todo: do it in parallel
  let i = 0;
  for (const key in ctx.locals.pageConfig.datasources) {
    const datasource = ctx.locals.pageConfig.datasources[key];
    if (datasource.provider === "http") {
      i++;
      if (i > MAX_LIVE_DATASOURCES) {
        console.warn(`Exceeded maximum number of live datasources (${MAX_LIVE_DATASOURCES}).`);
        break;
      }
      const res = await fetch(datasource.url);
      if (res.ok) {
        pageContext.data[key] = (await res.json()) as DatasourceGenericResolved<any>;
      }
    }
  }

  let render: typeof import("@enpage/sdk/builder/vite-entry-server").render;

  if (isProduction) {
    render = (await import("@enpage/sdk/builder/vite-entry-server")).render;
    // todo: differentiate between node and cf to use the right S3 client
    let { html, state } = isCF
      ? await render(url, ctx.locals.pageConfig, pageContext, (ctx.platform.env as EnpageEnv).SITES_R2_BUCKET)
      : await render(url, ctx.locals.pageConfig, pageContext, env.SITES_R2_BUCKET);
    html = html.replace("// ENPAGE_STATE_PLACEHOLDER", `window.__ENPAGE_STATE__ = ${JSON.stringify(state)};`);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response("Not found.", { status: 404 });
}

function isCloudflare(
  ctx: RequestContext<CloudflareWorkersPlatformInfo | NodePlatformInfo>,
): ctx is RequestContext<CloudflareWorkersPlatformInfo> {
  return "name" in ctx.platform && ctx.platform.name === "cloudflare-workers";
}
