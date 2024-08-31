import type { Locals } from "@hattip/compose";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";

// augment window object with custom properties
declare global {
  interface Window {
    enpage: import("./src/browser/js-api").EnpageJavascriptAPI;
    __ENPAGE_STATE__: ConstructorParameters<typeof import("./src/browser/js-api").EnpageJavascriptAPI>;
  }
}

declare module "@hattip/compose" {
  interface Locals {
    pageConfig: import("./src/shared/page-config").GenericPageConfig;
    vite: import("vite").ViteDevServer;
  }
}

declare module "@hattip/adapter-cloudflare-workers" {
  interface CloudflareWorkersPlatformInfo {
    env: import("./src/shared/env").EnpageEnv;
  }
}
