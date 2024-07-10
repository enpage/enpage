import { createServer, build, preview } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function startDevServer() {
  process.env.NODE_ENV = "development";

  const server = await createServer({
    configFile: resolve(__dirname, "./config/vite.config.js"),
    cacheDir: process.cwd() + "/.cache",
  });

  const logger = server.config.logger;

  await server.listen();

  logger.info("Dev Server is running:\n");
  server.resolvedUrls?.local.forEach((url) => {
    logger.info(`  ➜  Local:   ${chalk.green(url)}`);
  });
  server.resolvedUrls?.network.forEach((url) => {
    logger.info(`  ➜  Network: ${chalk.gray(url)}`);
  });
  server.bindCLIShortcuts({
    print: true,
  });
  logger.info("");
}

export async function buildTemplate() {
  process.env.NODE_ENV = "production";
  await build({
    configFile: resolve(__dirname, "./config/vite.config.js"),
  });
}

export async function previewTemplate() {
  process.env.NODE_ENV = "production";
  const server = await preview({
    configFile: resolve(__dirname, "./config/vite.config.js"),
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
