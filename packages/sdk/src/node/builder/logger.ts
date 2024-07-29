import { createLogger as createLoggerBase, type LogLevel } from "vite";
import { version } from "../../../package.json";
import chalk from "chalk";

export function createLogger(level?: LogLevel, allowClearScreen?: boolean, showVersion = false) {
  const logger = createLoggerBase(level, {
    prefix: "[enpage]",
    allowClearScreen,
  });

  if (showVersion) {
    logger.info(chalk.bold.green(`🚀 Enpage v${version}\n`));
  }

  return logger;
}
