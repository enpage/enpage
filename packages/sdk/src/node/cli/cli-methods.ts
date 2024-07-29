import { createServer, build, preview } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { createLogger } from "../builder/logger";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configFile = resolve(__dirname, "../builder/vite-config.js");
const serverEntryFile = resolve(__dirname, "../builder/vite-entry-server.js");

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ArgOpts<Opts extends Record<string, any>> = {
  args: unknown[];
  options: Opts;
};

export type CommonOptions = {
  logLevel?: "info" | "warn" | "error" | "silent";
  clearScreen?: boolean;
  ssr?: boolean;
};

export async function startDevServer({ args, options }: ArgOpts<CommonOptions>) {
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3000}`;
  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");

  const customLogger = createLogger(options.logLevel, options.clearScreen, true);

  const server = await createServer({
    configFile,
    customLogger,
    cacheDir: `${process.cwd()}/.cache`,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    mode: "development",
    server: {
      port: +port,
    },
  });

  const logger = server.config.logger;

  await server.listen();

  logger.info("Dev Server is running:\n");
  server.printUrls();
  server.bindCLIShortcuts({
    print: true,
  });
  logger.info("");
}

export async function buildTemplate({ args, options }: ArgOpts<CommonOptions>) {
  const customLogger = createLogger(options.logLevel, options.clearScreen, true);

  if (options.ssr) {
    // 1. client build
    await build({
      configFile,
      customLogger,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      build: {
        ssrManifest: true,
        emptyOutDir: true,
      },
    });

    // 2. server build
    await build({
      configFile,
      customLogger,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      ssr: {
        target: "webworker",
      },
      build: {
        ssr: serverEntryFile,
      },
    });
  } else {
    await build({
      configFile,
      customLogger,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      build: {
        emptyOutDir: true,
      },
    });
  }
}

export async function previewTemplate({ args, options }: ArgOpts<CommonOptions>) {
  const customLogger = createLogger(options.logLevel, options.clearScreen, true);
  const server = await preview({
    configFile,
    customLogger,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
  });
  const logger = server.config.logger;
  logger.info(chalk.blue("Preview your template at:"));
  server.printUrls();
  server.bindCLIShortcuts({
    print: true,
  });
  logger.info("");
}
