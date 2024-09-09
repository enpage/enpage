import type { CommandArgOpts, CommonOptions } from "../../types";
import { createServer } from "~/server/node/server";

export async function preview({ args, options, logger }: CommandArgOpts<CommonOptions>) {
  // Forcing the environment to local-preview
  process.env.NODE_ENV = "local-preview";
  process.env.ENPAGE_SITE_HOST ??= `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3001}`;

  const [, port] = process.env.ENPAGE_SITE_HOST.split(":");

  createServer(port);
}
