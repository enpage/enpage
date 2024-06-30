import type { EnpageTemplateConfig } from "@enpage/types/config";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import type { Plugin } from "vite";
import { Liquid } from "liquidjs";
import { PageContext } from "@enpage/types/context";
import { logger } from "./logger";
import { JSDOM, VirtualConsole } from "jsdom";

export function renderTemplate(cfg: EnpageTemplateConfig): Plugin {
  let isBuildMode = false;

  return {
    name: "enpage-render",
    enforce: "pre",
    configResolved(config) {
      isBuildMode = config.command === "build";
    },
    async transformIndexHtml(html) {
      const SSR = process.env.ENPAGE_SSR === "true";

      let ctx = isBuildMode ? await fetchContext(cfg) : createFakeContext(cfg);
      if (ctx === false) {
        logger.error("Failed to fetch context. Using fake context instead.");
        ctx = createFakeContext(cfg);
      }

      // disable JSDOM errors otherwise we'll get a lot of noise
      // for things like CSS imports or other new CSS features
      // not recognized by JSDOM
      const virtualConsole = new VirtualConsole();
      virtualConsole.sendTo(console, { omitJSDOMErrors: true });

      const dom = new JSDOM(html, { virtualConsole });
      const body = dom.window.document.querySelector("body");

      // append script to body
      const script = dom.window.document.createElement("script");
      script.textContent = `window._enpageCtx = ${JSON.stringify(ctx)};`;
      body?.appendChild(script);

      const finalHtml = dom.serialize();

      if (SSR) {
        return renderLiquid(finalHtml, ctx, cfg);
      }

      return finalHtml;
    },
  };
}

function renderLiquid(html: string, ctx: PageContext<any, any> | undefined, cfg: EnpageTemplateConfig) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
