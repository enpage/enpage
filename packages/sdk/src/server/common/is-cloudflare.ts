import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";
import type { PlatformInfo } from "./render-handler";

export function isCloudflare(
  ctx: RequestContext<PlatformInfo>,
): ctx is RequestContext<CloudflareWorkersPlatformInfo> {
  return "name" in ctx.platform && ctx.platform.name === "cloudflare-workers";
}
