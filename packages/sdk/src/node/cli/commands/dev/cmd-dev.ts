import getPort, { portNumbers } from "get-port";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDevServer } from "~/server/node/dev-server";
import type { CommandArgOpts, CommonOptions } from "../../types";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configFile = resolve(__dirname, "../builder/vite-config.js");

export async function startDevServer({ args, options, logger }: CommandArgOpts<CommonOptions>) {
  // Get an available port. First try the env var PORT, then default to 3000, then let get-port find one.
  const wanted = process.env.PORT ? +process.env.PORT : 3000;
  const port = await getPort({ port: portNumbers(wanted, wanted + 20) });
  // force development mode
  process.env.NODE_ENV = "development";
  // set the site host
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${port}`;

  createDevServer(port, {
    configFile,
    customLogger: logger,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
  });
}
