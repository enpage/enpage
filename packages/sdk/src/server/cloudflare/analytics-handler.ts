import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";
import { AnalyticsFunctions } from "../common/analytics";

export default async function analyticsHdl(ctx: RequestContext<CloudflareWorkersPlatformInfo>) {
  //  we have access to the page config
  const pageConfig = ctx.locals.pageConfig;

  AnalyticsFunctions.trackVisit(pageConfig.id, pageConfig.version, ctx);

  const url = new URL(ctx.request.url);
  const buttonId = url.searchParams.get("buttonId");
  // if pahtname contains /_/click, we track the click
  if (url.pathname.includes("/_/click") && buttonId) {
    AnalyticsFunctions.trackClick(pageConfig.id, pageConfig.version, buttonId, ctx);
  }
}
