import { EnpageTemplateConfig } from "./types";
import { logger } from "./logger";

export async function loadEnpageConfig(configPath: string) {
  try {
    //
    const cfg: EnpageTemplateConfig = await import(configPath);
    for (const key in cfg.datasources) {
      if (!cfg.datasources[key].provider && !cfg.datasources[key].sampleData) {
        logger.warn(
          `🔴 Warning! Datasource "${key}" is missing sample data! 
   Please check your enpage.config.js file and add a 
   "sampleData" key to your ${key} datasource.
   `,
        );
      }
    }
    return cfg;
  } catch (e) {
    logger.warn("No enpage.config.{js,ts} found. No datasources will be loaded.");
    return null;
  }
}
