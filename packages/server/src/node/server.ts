import type { HattipHandler } from "@hattip/core";
import {
  createServer as createNodeServer,
  createMiddleware as createHattipMiddleware,
  type NodePlatformInfo,
} from "@hattip/adapter-node";

export default function createServer(handler: HattipHandler<NodePlatformInfo>) {
  return createNodeServer(handler);
}

export function createMiddleware(handler: HattipHandler<NodePlatformInfo>) {
  return createHattipMiddleware(handler);
}
