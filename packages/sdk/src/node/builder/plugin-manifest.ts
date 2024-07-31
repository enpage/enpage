import type { ConfigEnv, Plugin } from "vite";
import type { EnpageEnv } from "~/shared/env";
import type { EnpageTemplateConfig } from "~/shared/template-config";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Generate Enpage template manifest
 */
export const manifestPlugin = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  return {
    name: "enpage:manifest",
    generateBundle() {
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
  for (const key in jsonConfig.datasources) {
    if (jsonConfig.datasources[key].schema) {
      jsonConfig.datasources[key].schema = zodToJsonSchema(jsonConfig.datasources[key].schema, key);
    }
  }
  return jsonConfig;
}
