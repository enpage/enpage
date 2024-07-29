import { Locals } from "@hattip/compose";
import { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";

declare module "@hattip/compose" {
  interface Locals {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    pageContext: import("@enpage/sdk/context").PageContext<any, any>;
  }
}

declare module "@hattip/adapter-cloudflare-workers" {
  interface CloudflareWorkersPlatformInfo {
    env: import("./src/shared/types").EnpageEnv;
  }
}
