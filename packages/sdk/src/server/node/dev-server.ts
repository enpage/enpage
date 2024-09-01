import type { InlineConfig } from "vite";
import { createServer } from "vite";
import readline from "node:readline";
import express from "express";
import chalk from "chalk";
import open from "open";
import { createDevMiddleware } from "./middleware";
import { displayServerUrls } from "./network-utils";

export async function createDevServer(port: number | string, viteConfig: Partial<InlineConfig>) {
  const app = express();
  const vite = await createServer({
    base: "/",
    envPrefix: "PUBLIC_",
    envDir: process.cwd(),
    server: { middlewareMode: true, hmr: { port: +port + 1 } },
    appType: "custom",
    cacheDir: `${process.cwd()}/.cache`,
    ...viteConfig,
  });

  const logger = vite.config.logger;

  app.use(vite.middlewares);
  app.use(createDevMiddleware(vite));

  const server = app.listen(port, () => {
    logger.info("Enpage Dev Server listening:\n");
    displayServerUrls(port, logger);
    showHelp();
    logger.info("");
  });

  if (process.stdout.isTTY) {
    const rl = readline.createInterface({ input: process.stdin });
    rl.on("line", onInput);
    app.on("close", rl.close);
  }

  function showHelp() {
    logger.info("Shortcuts:");
    logger.info(`  ${chalk.cyan("o")}  open browser`);
    logger.info(`  ${chalk.cyan("c")}  clear console`);
    logger.info(`  ${chalk.cyan("r")}  restart server`);
    logger.info(`  ${chalk.cyan("u")}  show urls`);
    logger.info(`  ${chalk.cyan("h")}  show this help`);
    logger.info(`  ${chalk.cyan("q")}  quit`);
  }

  function onInput(line: string) {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    switch (line) {
      case "h":
        showHelp();
        break;
      case "o":
        open(`http://localhost:${port}`);
        break;
      case "r":
        vite.restart(true);
        break;
      case "u":
        logger.info("Server urls:");
        displayServerUrls(port, logger);
        break;
      case "q":
        server.close(() => {
          process.exit(0);
        });
        break;
      case "c":
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        break;
    }
  }
}
