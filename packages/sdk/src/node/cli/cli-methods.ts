import { build, preview } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { createLogger } from "../builder/logger";
import { createDevServer } from "~/server/node/dev-server";
import { createServer } from "~/server/node/server";

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

  createDevServer(port, {
    configFile,
    customLogger,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
  });
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
  process.env.NODE_ENV = "local-preview";
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3001}`;
  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");
  createServer(port, customLogger);
}
