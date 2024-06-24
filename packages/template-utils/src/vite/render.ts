import type { EnpageTemplateConfig } from "@enpage/types/config";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import type { Plugin } from "vite";
import { Liquid } from "liquidjs";
import { PageContext } from "@enpage/types/context";
import { logger } from "./logger";

export function renderTemplate(cfg: EnpageTemplateConfig): Plugin {
  let isBuildMode = false;

  return {
    name: "enpage-render",
    enforce: "pre",
    configResolved(config) {
      isBuildMode = config.command === "build";
    },
    async transformIndexHtml(html) {
      let ctx = isBuildMode ? await fetchContext(cfg) : createFakeContext(cfg);
      if (ctx === false) {
        logger.error("Failed to fetch context. Using fake context instead.");
        ctx = createFakeContext(cfg);
      }
      return render(html, ctx, cfg);
    },
  };
}

function render(html: string, ctx: PageContext<any, any> | undefined, cfg: EnpageTemplateConfig) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
