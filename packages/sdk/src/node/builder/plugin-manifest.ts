import type { ConfigEnv, Plugin } from "vite";
import type { EnpageEnv } from "~/shared/env";
import type { EnpageTemplateConfig } from "~/shared/template-config";

/**
 * Generate Enpage template manifest
 */
export const manifestPlugin = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  return {
    name: "enpage:manifest",
    generateBundle() {
      console.log("Generating Enpage manifest");
      if (viteEnv.isSsrBuild) {
        return;
      }
      this.emitFile({
        type: "asset",
        fileName: ".vite/enpage.manifest.json",
        source: JSON.stringify(cfg, null, 2),
      });
    },
  };
};
