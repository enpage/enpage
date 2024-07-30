import {
  createServer as createNodeServer,
  type NodePlatformInfo,
  createMiddleware as createHattipMiddleware,
} from "@hattip/adapter-node/native-fetch";
import renderHandler from "../common/render-handler";
import { compose, type RequestHandler } from "@hattip/compose";
import pageConfigHdl from "./page-config-handler";
import type { ViteDevServer } from "vite";
import viteHandler from "../common/vite-handler";

export default function createServer(
  viteDevServer?: ViteDevServer,
  pageConfigHandler: RequestHandler<NodePlatformInfo> = pageConfigHdl,
  renderingHandler: RequestHandler<NodePlatformInfo> = renderHandler,
) {
  const handler = compose(viteHandler(viteDevServer), pageConfigHandler, renderingHandler);
  return createNodeServer(handler);
}

export function createNodeMiddleware(
  viteDevServer?: ViteDevServer,
  pageConfigHandler: RequestHandler<NodePlatformInfo> = pageConfigHdl,
  renderingHandler: RequestHandler<NodePlatformInfo> = renderHandler,
) {
  const handler = compose(viteHandler(viteDevServer), pageConfigHandler, renderingHandler);
  return createHattipMiddleware(handler);
}
