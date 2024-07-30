import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { ConfigEnv, Logger, Plugin } from "vite";
import type { PageContext } from "~/shared/page-context";
import { createFakeContext, fetchContext } from "./context";

export const contextPlugin = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv): Plugin => {
  const isBuildMode = viteEnv.command === "build";
  const isSsrBuild = viteEnv.isSsrBuild;

  return {
    name: "enpage:context",
    enforce: "pre",
    async config(config) {
      if (isSsrBuild) {
        console.warn("SSR build detected. Skipping context fetch.");
        return;
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let context: PageContext<any, any> | undefined | false = undefined;

      // If in dev mode, use fake context
      if (!isBuildMode) {
        // console.warn("Using fake context.");
        context = createFakeContext(cfg);

        // If in build mode, fetch context from API if not SSR build
      } else if (!isSsrBuild) {
        // if config.build?.ssrManifest === true, only fetch attributes
        context = (await fetchContext(cfg)) || createFakeContext(cfg);
      }
      // @ts-expect-error
      config.enpageContext = context;
    },
  };
};
