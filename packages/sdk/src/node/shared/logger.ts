import {
  createLogger as createLoggerBase,
  type LogLevel,
  type LogOptions,
  type Logger as BaseLogger,
} from "vite";
import { version } from "../../../package.json";
import chalk from "chalk";

export function createLogger(level?: LogLevel, allowClearScreen?: boolean, showVersion = false) {
  const logger = createLoggerBase(level, {
    prefix: "[enpage]",
    allowClearScreen,
  });

  if (showVersion) {
    logger.info(chalk.hex("#7270c6").bold(`🚀 Enpage v${version}\n`));
  }

  Object.assign(logger, {
    success: (message: string, options: LogOptions) => logger.info(chalk.green(message), options),
    error: (message: string, options: LogOptions) => logger.info(chalk.red(message), options),
    warn: (message: string, options: LogOptions) => logger.info(chalk.yellow(message), options),
  });

  return logger;
}

export const logger = createLogger();
export type Logger = BaseLogger & {
  success: (message: string, options?: LogOptions) => void;
};
