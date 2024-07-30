import { createServer, build, preview } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { createLogger } from "../builder/logger";
import createNodeServer, { createNodeMiddleware } from "~/server/node/server";
import os from "node:os";
import express from "express";

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
};

export type BuildOptions = {
  ssr?: boolean | "local";
};

export async function startDevServer({ args, options }: ArgOpts<CommonOptions>) {
  process.env.NODE_ENV = "development";
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3000}`;

  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");
  const customLogger = createLogger(options.logLevel, options.clearScreen, true);

  const app = express();
  const vite = await createServer({
    base: "/",
    server: { middlewareMode: true },
    appType: "custom",
    configFile,
    customLogger,
    cacheDir: `${process.cwd()}/.cache`,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
  });

  const hattipMiddleware = createNodeMiddleware(vite);

  app.use(vite.middlewares);
  app.use(hattipMiddleware);

  app.listen(port, () => {
    const logger = vite.config.logger;
    logger.info("Enpage Dev Server is running:\n");
    displayServerUrls(port);
    logger.info("");
  });

  // logger.info("Dev Server is running:\n");
  // vite.printUrls();
  // vite.bindCLIShortcuts({
  //   print: true,
  // });

  // createNodeMiddleware(vite).listen(port, () => {
  //   logger.info("Enpage Dev Server is running:\n");
  //   displayServerUrls(port);
  //   logger.info("");
  // });

  // const [, port] = process.env.ENPAGE_SITE_HOST.split(":");
  // const customLogger = createLogger(options.logLevel, options.clearScreen, true);

  // const server = await createServer({
  //   configFile,
  //   customLogger,
  //   cacheDir: `${process.cwd()}/.cache`,
  //   logLevel: options.logLevel,
  //   clearScreen: options.clearScreen,
  //   server: {
  //     port: +port,
  //   },
  // });

  // await server.listen();

  // server.printUrls();
  // server.bindCLIShortcuts({
  //   print: true,
  // });
  // logger.info("");
}

export async function buildTemplate({ args, options }: ArgOpts<CommonOptions & BuildOptions>) {
  const customLogger = createLogger(options.logLevel, options.clearScreen, true);

  let mode = "production";

  if (options.ssr === "local") {
    mode = "development";
    process.env.NODE_ENV = mode;
  }

  if (options.ssr) {
    // 1. client build
    await build({
      configFile,
      customLogger,
      mode,
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
      mode,
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

function displayServerUrls(port: number | string): void {
  const localUrl = `http://localhost:${port}`;
  const networkUrls = getNetworkUrls(port);
  console.log(`  ▸ Local:    ${chalk.cyan(localUrl)}`);
  for (const url of networkUrls) {
    console.log(`  ▸ Network:  ${chalk.gray(url)}`);
  }
}

function getNetworkUrls(port: number | string): string[] {
  const interfaces = os.networkInterfaces();
  const urls: string[] = [];

  for (const interfaceName in interfaces) {
    const networkInterfaces = interfaces[interfaceName];
    if (!networkInterfaces) continue;
    for (let i = 0; i < networkInterfaces.length; i++) {
      const networkInterface = networkInterfaces[i];
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (networkInterface.family === "IPv4" && !networkInterface.internal) {
        urls.push(`http://${networkInterface.address}:${port} (${interfaceName})`);
      }
    }
  }

  return urls;
}
