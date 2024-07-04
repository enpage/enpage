import type { EnpageTemplateConfig } from "@enpage/types/config";
import { templateSettingsSchema } from "@enpage/types/settings";
import { logger } from "./logger";
import { defineAttributes } from "@enpage/sdk/attributes";

export async function loadEnpageConfig(configPath: string) {
  try {
    //
    const cfg: EnpageTemplateConfig = await import(configPath);
    for (const key in cfg.datasources) {
      if (!cfg.datasources[key].provider && !cfg.datasources[key].sampleData) {
        logger.warn(
          `🔴 Warning! Datasource "${key}" is missing sample data - nothing will be rendered during development! Please check your enpage.config.js file and add a "sampleData" key to your ${key} datasource.`,
        );
      }
    }

    if (!cfg.attributes) {
      cfg.attributes = defineAttributes({});
    }

    const validated = templateSettingsSchema.safeParse(cfg.settings);
    if (!validated.success) {
      logger.error(`🔴 Error! enpage.config.js settings are invalid\n\n`);
      process.exit(1);
    }

    return cfg;
  } catch (e) {
    logger.error(
      "No enpage.config.js found!\nYour project must have an enpage.config.js file in the root directory.\n\n",
    );
    process.exit(1);
  }
}
