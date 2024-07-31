import type { InlineConfig } from "vite";
import { createServer } from "vite";
import express from "express";

import { createDevMiddleware } from "./middleware";
import { displayServerUrls } from "./network-utils";

export async function createDevServer(port: number | string, viteConfig: Partial<InlineConfig>) {
  const app = express();
  const vite = await createServer({
    base: "/",
    envPrefix: "PUBLIC_",
    envDir: process.cwd(),
    server: { middlewareMode: true },
    appType: "custom",
    cacheDir: `${process.cwd()}/.cache`,
    ...viteConfig,
  });

  app.use(vite.middlewares);
  app.use(createDevMiddleware(vite));

  app.listen(port, () => {
    const logger = vite.config.logger;
    logger.info("Enpage Dev Server listening:\n");
    displayServerUrls(port);
    logger.info("");
  });
}
