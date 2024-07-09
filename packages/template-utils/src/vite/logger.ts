import type { TemplateSettings } from "@enpage/types/settings";
import { createLogger as createLoggerBase, UserConfig } from "vite";

export function createLogger(settings: TemplateSettings) {
  return createLoggerBase(settings.logLevel, {
    prefix: "[enpage]",
    allowClearScreen: settings.clearScreen,
  });
}
