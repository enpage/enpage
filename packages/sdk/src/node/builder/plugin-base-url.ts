import { JSDOM, VirtualConsole } from "jsdom";
import type { ConfigEnv, Plugin } from "vite";
import type { EnpageEnv } from "~/shared/env";
import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { Logger } from "../shared/logger";

export const insertBasePlugin = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  const isBuildMode = viteEnv.command === "build";
  let logger: Logger;
  let serverHostname = process.env.ENPAGE_SITE_HOST;

  return {
    name: "enpage:base-url",
    configResolved(config) {
      logger = config.logger as Logger;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        serverHostname = req.headers.host;
        next();
      });
    },
    transformIndexHtml: {
      // order: "post",
      handler: async (html: string, viteCtx) => {
        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });
        const dom = new JSDOM(html, { virtualConsole });
        const doc = dom.window.document;
        const head = doc.querySelector("head");

        // add base if not build
        if (!isBuildMode && head) {
          const base = doc.createElement("base");
          base.href = `http://${serverHostname}`;
          // @ts-ignore
          head.prepend(base);

          return dom.serialize();
        }
      },
    },
  };
};
