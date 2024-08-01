import type { RequestContext } from "@hattip/compose";
import type { EnpageEnv } from "~/shared/env";
import { isCloudflare } from "./is-cloudflare";
import type { PlatformInfo } from "./render-handler";

export function getEnvironment(ctx: RequestContext<PlatformInfo>): EnpageEnv {
  return isCloudflare(ctx) ? (ctx.platform.env as EnpageEnv) : (process.env as unknown as EnpageEnv);
}
