import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { ConfigEnv, Plugin } from "vite";
import type { PageContext } from "~/shared/page-config";
import { createFakeContext, fetchContext } from "./page-context";
import type { EnpageEnv } from "~/shared/env";

export const contextPlugin = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  const isBuildMode = viteEnv.command === "build";
  const isSsrBuild = viteEnv.isSsrBuild;

  return {
    name: "enpage:context",
    // enforce: "pre",
    async config(config) {
      if (isSsrBuild || config.build?.ssrManifest) {
        // SSR build detected. Skipping context fetch
        return;
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let context: PageContext<any, any> | undefined | false = undefined;
      const fullEnv: EnpageEnv = { ...process.env, ...env };

      // If in dev mode, use fake context
      if (!isBuildMode) {
        console.warn("Using fake context.");
        context = createFakeContext(cfg);
        // If in build mode, fetch context from API if not SSR build
      } else if (!isSsrBuild) {
        context = (await fetchContext(cfg, fullEnv)) || createFakeContext(cfg);
      }
      // @ts-expect-error
      config.enpageContext = context;
    },
  };
};
