import express from "express";
import path from "node:path";
import favicon from "serve-favicon";
import { createMiddleware } from "./middleware";
import type { Logger } from "vite";
import { displayServerUrls } from "./network-utils";
import { getBuildDirectories } from "./path-utils";
import { logger as _logger } from "~/node/shared/logger";

export async function createServer(port: number | string, logger: Logger = _logger) {
  const app = express();
  const { assets } = getBuildDirectories();
  app.use("/assets", express.static(assets));
  app.use(favicon(path.join(process.cwd(), "public", "favicon.ico")));
  app.use(createMiddleware());
  app.listen(port, () => {
    logger.info("Enpage Server listening:\n");
    displayServerUrls(port, logger);
    logger.info("");
  });
}
