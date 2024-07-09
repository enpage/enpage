import type { EnpageTemplateConfig } from "@enpage/types/config";
import { templateSettingsSchema } from "@enpage/types/settings";
import { createLogger } from "./vite/logger";
import { defineAttributes } from "@enpage/sdk/attributes";
import fs from "fs";

export async function loadEnpageConfig(configPath: string) {
  if (!fs.existsSync(configPath)) {
    console.error(
      "No enpage.config.js found!\nYour project must have an enpage.config.js file in the root directory.\n\n",
    );
    process.exit(1);
  }
  const config: EnpageTemplateConfig = await import(configPath);

  const logger = createLogger(config.settings);
  //

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

  const validated = templateSettingsSchema.safeParse(config.settings);
  if (!validated.success) {
    logger.error(`🔴 Error! enpage.config.js settings are invalid. Check your call to defineSettings().\n\n`);
    process.exit(1);
  }

  return { config, logger };
}
