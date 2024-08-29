import type { ArgOpts, CommonOptions } from "../../types";
import { createServer } from "~/server/node/server";

export async function preview({ args, options }: ArgOpts<CommonOptions>) {
  process.env.NODE_ENV = "local-preview";
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3001}`;
  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");
  createServer(port);
}
