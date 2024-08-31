import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDevServer } from "~/server/node/dev-server";
import type { ArgOpts, CommonOptions } from "../../types";
import { logger } from "~/node/shared/logger";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configFile = resolve(__dirname, "../builder/vite-config.js");

export async function startDevServer({ args, options }: ArgOpts<CommonOptions>) {
  process.env.NODE_ENV = "development";
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3000}`;

  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");

  createDevServer(port, {
    configFile,
    customLogger: logger,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
  });
}
