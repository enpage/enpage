import { Locals } from "@hattip/compose";
import { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";

// augment window object with custom properties
declare global {
  interface Window {
    enpage: import("./src/browser/js-api").EnpageJavascriptAPI;
    __ENPAGE_STATE__: ConstructorParameters<typeof import("./src/browser/js-api").EnpageJavascriptAPI>;
  }
}

declare module "@hattip/compose" {
  interface Locals {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    pageConfig: import("@enpage/sdk/page-config").PageConfig<any, any>;
    vite: import("vite").ViteDevServer;
  }
}

declare module "@hattip/adapter-cloudflare-workers" {
  interface CloudflareWorkersPlatformInfo {
    env: import("./src/shared/env").EnpageEnv;
  }
}
