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
      if (viteEnv.isSsrBuild) {
        return;
      }
      this.emitFile({
        type: "asset",
        fileName: ".vite/enpage.manifest.json",
        source: JSON.stringify(serializeConfig(cfg), null, 2),
      });
    },
  };
};

// convert all schemas in template config to JSON schema
function serializeConfig(cfg: EnpageTemplateConfig) {
  const jsonConfig = { ...cfg };
  console.log("serializing config");
  // console.dir(cfg.datasources, { depth: null });
  // for (const key in jsonConfig.datasources) {
  //   if (jsonConfig.datasources[key].schema) {
  //     try {
  //       jsonConfig.datasources[key].schema = zodToJsonSchema(jsonConfig.datasources[key].schema, {
  //         name: key,
  //       });
  //     } catch (e) {
  //       console.error(
  //         `Failed to convert schema to JSON schema for datasource ${key}: `,
  //         (e as Error).message,
  //       );
  //     }
  //   }
  // }
  // return jsonConfig;
}
