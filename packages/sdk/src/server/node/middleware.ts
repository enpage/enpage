import {
  type NodePlatformInfo,
  createMiddleware as createHattipMiddleware,
} from "@hattip/adapter-node/native-fetch";
import renderHandler from "../common/render-handler";
import { compose, type RequestHandler } from "@hattip/compose";
import pageConfigHdl from "./page-config-handler";
import type { ViteDevServer } from "vite";
import viteHandler from "../common/vite-handler";

export function createDevMiddleware(
  viteDevServer: ViteDevServer,
  pageConfigHandler: RequestHandler<NodePlatformInfo> = pageConfigHdl,
  renderingHandler: RequestHandler<NodePlatformInfo> = renderHandler,
) {
  return createFromMiddlewares(viteHandler(viteDevServer), pageConfigHandler, renderingHandler);
}

export function createMiddleware(
  pageConfigHandler: RequestHandler<NodePlatformInfo> = pageConfigHdl,
  renderingHandler: RequestHandler<NodePlatformInfo> = renderHandler,
) {
  return createFromMiddlewares(pageConfigHandler, renderingHandler);
}

function createFromMiddlewares(...middlewares: RequestHandler<NodePlatformInfo>[]) {
  const handler = compose(...middlewares);
  return createHattipMiddleware(handler);
}
