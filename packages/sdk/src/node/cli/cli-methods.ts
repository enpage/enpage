import { build } from "vite";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLogger } from "../builder/logger";
import { createDevServer } from "~/server/node/dev-server";
import { createServer } from "~/server/node/server";
import { getLocalPageConfig } from "~/server/node/local-page-config";
import { nanoid } from "nanoid";
import { templateManifestSchema } from "~/shared/manifest";
import { fromError } from "zod-validation-error";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import Conf from "conf";
import chalk from "chalk";
import { sync as rmSync } from "rimraf";
import { getPackageManager } from "./helpers";
import { uploadFiles } from "./upload";
import { performLogin } from "./login";
import { CLI_PROJECT_NAME } from "./constants";
import type { EnpageCliCAccessConfigFile } from "./types";

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
  clean?: boolean;
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

  console.log("Building template...", options);

  if (options.clean) {
    rmSync(path.join(process.cwd(), ".enpage", "dist"));
  }

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

export async function submitTemplate({ args, options }: ArgOpts<CommonOptions>) {
  const logger = createLogger(options.logLevel, options.clearScreen);
  const cliConfig = new Conf<EnpageCliCAccessConfigFile>({ projectName: CLI_PROJECT_NAME });
  const token: string | undefined = process.env.ENPAGE_API_TOKEN ?? (cliConfig.get("access_token") as string);

  if (!token) {
    const pkgCmd = getPackageManager();
    if (process.stdout.isTTY) {
      logger.error(
        `  ${chalk.redBright("Error")}: User token not found. Please run '${pkgCmd} run login' to authenticate.\n`,
      );
    } else {
      logger.error(
        `  ${chalk.redBright("Error")}: User token not found. Please set ENPAGE_API_TOKEN environment variable.\n`,
      );
    }
    process.exit(1);
  }

  // check if enpage.config.js and package.json exist in the current directory
  // if not, exit with an error
  const files = ["enpage.config.js", "package.json"];
  for (const file of files) {
    if (!existsSync(resolve(process.cwd(), file))) {
      logger.error(
        `  ${chalk.redBright("Error")}: file ${file} not found in the current directory. Aborting.\n`,
      );
      process.exit(1);
    }
  }

  // load manifest from both enpage.config.js and package.json
  // manifest.json is used to store the template ID for future updates
  const { templateManifest } = await getLocalPageConfig();

  // validate manifest
  const validation = templateManifestSchema.safeParse(templateManifest);
  if (!validation.success) {
    const err = fromError(validation.error);
    logger.error("Invalid template manifest. Please review your enpage.config.js file.");
    logger.error(`Error: ${err.toString()}\n\n`);
    process.exit(1);
  }

  // load package.json to get the template ID (if it exists)
  const pkg = JSON.parse(await fs.readFile(resolve(process.cwd(), "package.json"), "utf-8"));
  const templateId = pkg.enpage?.id ?? `tpl_${nanoid(10)}`;

  // submit template to Enpage
  logger.info(`Submitting template to Enpage...`);

  const uploadResults = await uploadFiles(templateId, token);

  if (uploadResults.hasUploadErrors) {
    logger.error("\n  Upload failed. Seet details above.\n");
    process.exit(1);
  }
}

export async function login({ options }: ArgOpts<CommonOptions>) {
  const logger = createLogger(options.logLevel, options.clearScreen, true);
  performLogin(logger);
}
