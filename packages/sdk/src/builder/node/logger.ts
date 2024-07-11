import type { TemplateSettings } from "@enpage/types/settings";
import { createLogger as createLoggerBase, UserConfig } from "vite";
import { version } from "../../../package.json";
import chalk from "chalk";

export function createLogger(settings: TemplateSettings) {
  const logger = createLoggerBase(settings.logLevel, {
    prefix: "[enpage]",
    allowClearScreen: settings.clearScreen,
  });

  logger.info(chalk.bold.green(`🚀 Enpage v${version}\n`));

  return logger;
}
