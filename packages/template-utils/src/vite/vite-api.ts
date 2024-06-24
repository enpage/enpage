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

  await server.listen();

  console.log(chalk.green("Enpage Dev Server is running:\n"));
  console.log(`- Local:   `, chalk.green(server.resolvedUrls?.local[0]));
  console.log("- Network: ", chalk.gray(server.resolvedUrls?.network[0]));
}

export async function buildTemplate() {
  process.env.NODE_ENV = "production";
  try {
    await build({
      configFile: resolve(__dirname, "./config/vite.config.js"),
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
  }
}

export async function previewTemplate() {
  process.env.NODE_ENV = "production";
  const server = await preview({
    configFile: resolve(__dirname, "./config/vite.config.js"),
  });

  console.log(chalk.blue("Preview you template at:"));
  console.log(`- Local:   `, chalk.green(server.resolvedUrls?.local[0]));
  console.log("- Network: ", chalk.gray(server.resolvedUrls?.network[0]));
}
