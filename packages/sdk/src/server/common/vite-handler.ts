import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers/no-static";
import type { NodePlatformInfo } from "@hattip/adapter-node/native-fetch";
import type { RequestContext } from "@hattip/compose";
import type { ViteDevServer } from "vite";

type PlatformInfo = CloudflareWorkersPlatformInfo | NodePlatformInfo;

export default function viteHandler(viteDevServer?: ViteDevServer) {
  return async (ctx: RequestContext<PlatformInfo>) => {
    if (viteDevServer) {
      ctx.locals.vite = viteDevServer;
    }
  };
}
