import { createServer, build, preview } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configFile = resolve(__dirname, "../builder/config-vite.js");

export async function startDevServer() {
  process.env.NODE_ENV = "development";
  process.env.ENPAGE_CONTEXT = "template-development";

  const server = await createServer({
    configFile,
    cacheDir: process.cwd() + "/.cache",
    mode: "development",
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

export async function buildTemplate() {
  process.env.NODE_ENV = "production";
  process.env.ENPAGE_CONTEXT = "template-build";
  await build({
    configFile,
    mode: "production",
  });
}

export async function previewTemplate() {
  process.env.NODE_ENV = "production";
  const server = await preview({
    configFile,
  });
  const logger = server.config.logger;

  logger.info(chalk.blue("Preview your template at:"));
  server.resolvedUrls?.local.forEach((url) => {
    logger.info(`  ➜  Local:   ${chalk.green(url)}`);
  });
  server.resolvedUrls?.network.forEach((url) => {
    logger.info(`  ➜  Network: ${chalk.gray(url)}`);
  });
}
