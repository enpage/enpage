import express from "express";
import { createMiddleware } from "./middleware";
import type { Logger } from "vite";
import { join } from "node:path";
import { displayServerUrls } from "./network-utils";

export async function createServer(port: number | string, logger: Logger) {
  const app = express();
  const assetsDir = join(process.cwd(), ".enpage", "dist", "assets");
  app.use("/assets", express.static(assetsDir));
  app.use(createMiddleware());
  app.listen(port, () => {
    logger.info("Enpage Server listening:\n");
    displayServerUrls(port);
    logger.info("");
  });
}
