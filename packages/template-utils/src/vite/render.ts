import type { EnpageTemplateConfig } from "@enpage/types/config";
import type { Plugin } from "vite";
import { Liquid } from "liquidjs";
import { PageContext } from "@enpage/types/context";

export function renderTemplate(cfg: EnpageTemplateConfig, ctx?: PageContext<any, any>): Plugin {
  let isBuildMode = false;

  return {
    name: "enpage-render",
    enforce: "pre",
    configResolved(config) {
      isBuildMode = config.command === "build";
    },
    async transformIndexHtml(html) {
      const SSR = process.env.ENPAGE_SSR === "true";
      if (SSR) {
        return renderLiquid(html, ctx, cfg);
      }
      return html;
    },
  };
}

function renderLiquid(html: string, ctx: PageContext<any, any> | undefined, cfg: EnpageTemplateConfig) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
