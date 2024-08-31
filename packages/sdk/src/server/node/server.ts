import express from "express";
import { createMiddleware } from "./middleware";
import type { Logger } from "vite";
import { displayServerUrls } from "./network-utils";
import { getBuildDirectories } from "./path-utils";
import { logger as _logger } from "~/node/shared/logger";

export async function createServer(port: number | string, logger: Logger = _logger) {
  const app = express();

  const { assets } = getBuildDirectories();

  app.use("/assets", express.static(assets));
  app.use(createMiddleware());
  app.listen(port, () => {
    logger.info("Enpage Server listening:\n");
    displayServerUrls(port, logger);
    logger.info("");
  });
}
