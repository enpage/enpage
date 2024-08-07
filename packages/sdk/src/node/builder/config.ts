import type { EnpageTemplateConfig } from "~/shared/template-config";
import { templateManifestSchema } from "~/shared/manifest";
import { defineAttributes } from "~/shared/attributes";
import fs from "node:fs";
import type { Logger } from "vite";

export async function loadConfig(configPath: string): Promise<EnpageTemplateConfig> {
  if (!fs.existsSync(configPath)) {
    console.error(
      "🔴 No enpage.config.js found!\nYour project must have an enpage.config.js file in the root directory.\n\n",
    );
    process.exit(1);
  }
  return import(configPath);
}

export function checkConfig(config: EnpageTemplateConfig, logger: Logger) {
  for (const key in config.datasources) {
    if (!config.datasources[key].provider && !config.datasources[key].sampleData) {
      logger.warn(
        `🔴 Warning! Datasource "${key}" is missing sample data - nothing will be rendered during development! Please check your enpage.config.js file and add a "sampleData" key to your ${key} datasource.`,
      );
    }
  }

  if (!config.attributes) {
    config.attributes = defineAttributes({});
  }

  const validated = templateManifestSchema.safeParse(config.manifest);
  if (!validated.success) {
    logger.error(`🔴 Error! enpage.config.js manifest is invalid. Check your call to defineManifest().\n\n`);
    process.exit(1);
  }

  return config;
}
