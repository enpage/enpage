import type { EnpageTemplateConfig } from "@enpage/types/config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { Logger, Plugin } from "vite";
import type { PageContext } from "@enpage/types/context";
import { Liquid } from "liquidjs";
import { minify } from "html-minifier";
import { createFakeContext, fetchContext } from "./context";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { version } from "../../../package.json";

export const render = (cfg: EnpageTemplateConfig): Plugin => {
  let isBuildMode = false;
  let isSsrBuild = false;
  let logger: Logger;

  return {
    name: "enpage:render",
    configResolved(config) {
      isBuildMode = config.command === "build";
      logger = config.logger;
    },
    config(_, env) {
      isSsrBuild = !!env.isSsrBuild;
    },
    transformIndexHtml: {
      order: "pre" as const,
      handler: async (html: string) => {
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

        const attrs = (ctx as PageContext<any, any>).attributes;
        const dom = new JSDOM(html, { virtualConsole });
        const doc = dom.window.document;
        const head = doc.querySelector("head");

        if (!head) {
          logger.error("No head element found in index.html");
          process.exit(1);
        }

        // Add Tailwind CSS
        if (!process.env.DISABLE_TAILWIND) {
          // const style = doc.createElement("style");
          // style.textContent = `@import "@enpage/style-system/tailwind.css";`;
          // head.appendChild(style);
        } else {
          logger.warnOnce(chalk.gray("render: tailwind is disabled"), {
            timestamp: true,
          });
        }

        // Enpage styles
        const enpageStyles = doc.createElement("style");
        enpageStyles.textContent = `@import "@enpage/style-system/client.css";`;
        head.appendChild(enpageStyles);

        // Add the vite preload error script (to reload the page on preload error)
        const vitePreloadErrorScript = doc.createElement("script");
        vitePreloadErrorScript.textContent = `
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
        `;
        head.appendChild(vitePreloadErrorScript);

        // Set site language. Will result in <html lang="xx">
        doc.documentElement.lang = attrs.$siteLanguage;

        // ----------------------------------------------------
        // Add meta tags if they don't exist

        // Charset
        if (!doc.querySelector("meta[charset]")) {
          const meta = doc.createElement("meta");
          meta.setAttribute("charset", "UTF-8");
          head.appendChild(meta);
        }

        // title
        if (!doc.querySelector("title") && attrs.$siteTitle) {
          const title = doc.createElement("title");
          title.textContent = attrs.$siteTitle;
          head.appendChild(title);
        }

        // description
        if (!doc.querySelector("meta[name='description']") && attrs.$siteDescription) {
          const meta = doc.createElement("meta");
          meta.setAttribute("name", "description");
          meta.setAttribute("content", attrs.$siteDescription);
          head.appendChild(meta);
        }

        // keywords
        if (!doc.querySelector("meta[name='keywords']") && ctx?.attributes.$siteKeywords) {
          const meta = doc.createElement("meta");
          meta.setAttribute("name", "keywords");
          meta.setAttribute("content", attrs.$siteKeywords);
          head?.appendChild(meta);
        }

        // viewport
        if (!doc.querySelector("meta[name='viewport']")) {
          const meta = doc.createElement("meta");
          meta.setAttribute("name", "viewport");
          meta.setAttribute("content", "width=device-width, initial-scale=1.0");
          head?.appendChild(meta);
        }

        // generator
        const generator = doc.createElement("meta");
        generator.setAttribute("name", "generator");
        generator.setAttribute("content", `Enpage v${version}`);
        head?.appendChild(generator);

        // Add enpage web components
        // const enpageComponentsScript = doc.createElement("script");
        // enpageComponentsScript.type = "module";
        // enpageComponentsScript.textContent = `import "@enpage/sdk/web-components";`;
        // head?.appendChild(enpageComponentsScript);
        // Hide all sections but the first one
        const sections = doc.querySelectorAll("body > section");
        const slugs: string[] = [];
        sections.forEach((section, index) => {
          let slug = section.getAttribute("ep-slug");
          if (!slug) {
            slug = nanoid(7);
            section.setAttribute("ep-slug", slug);
          }
          slugs.push(slug);
          if (index > 0) {
            section.setAttribute("hidden", "");
          } else {
            // make sure the first section has role="main"
            section.setAttribute("role", "main");
          }
        });

        // ----------------------------------------------------
        // Add enpage SDK script
        const enpageSdkScript = doc.createElement("script");
        enpageSdkScript.type = "module";
        enpageSdkScript.textContent = `
          import { EnpageJavascriptAPI } from "@enpage/sdk/browser/js-api";
          window.enpage = new EnpageJavascriptAPI(${ctx ? JSON.stringify(ctx) : "null"}, ${JSON.stringify(slugs)});
        `;
        head.appendChild(enpageSdkScript);

        // if not in SSR mode, add liquid js
        if (!isBuildMode) {
          const liquidScript = doc.createElement("script");
          liquidScript.type = "module";
          // resolved through alias in vite.config.ts
          liquidScript.textContent = `import "@enpage/liquid";`;
          head.appendChild(liquidScript);

          const clientRenderScript = doc.createElement("script");
          clientRenderScript.type = "module";
          clientRenderScript.textContent = `
            import { initDevClient } from "@enpage/sdk/browser/dev-client";
            initDevClient();
            window.enpage.addEventListener("afternavigate", initDevClient);
          `;
          head.appendChild(clientRenderScript);
          html = dom.serialize();
        }

        if (isSsrBuild) {
          logger.info("SSR: rendering liquid templates");
          html = await renderLiquid(dom.serialize(), ctx);
        }

        if (!isBuildMode) {
          return html;
        }

        logger.info("Minifying HTML");

        return minify(html, {
          removeComments: true,
          collapseWhitespace: true,
          ignoreCustomComments: [],
          minifyJS: true,
        });
      },
    },
  };
};

function renderLiquid(html: string, ctx: PageContext<any, any> | undefined) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
