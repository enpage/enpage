import { createServer, build } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function startDevServer() {
  process.env.NODE_ENV = "development";
  const server = await createServer({
    configFile: resolve(__dirname, "./config/vite.config.js"),
  });

  await server.listen();

  // server.printUrls();

  console.log(chalk.green("Enpage Server is running!\n"));

  // display in the console in blue color
  console.log(chalk.blue("Preview you template at:"));
  console.log(`- Local:   `, chalk.green(server.resolvedUrls?.local[0]));
  console.log("- Network: ", chalk.gray(server.resolvedUrls?.network[0]));

  // console.log("server.config", server.config);
  // server.bindCLIShortcuts({ print: true });
}

export async function buildSite() {
  try {
    await build({
      configFile: resolve(__dirname, "./config/vite.config.js"),
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
  }
}
