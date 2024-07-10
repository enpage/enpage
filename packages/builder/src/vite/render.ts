import type { EnpageTemplateConfig } from "@enpage/types/config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { Logger, Plugin } from "vite";
import type { PageContext } from "@enpage/types/context";
import { Liquid } from "liquidjs";
import { minify } from "html-minifier";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import chalk from "chalk";
import { nanoid } from "nanoid";

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

        const dom = new JSDOM(html, { virtualConsole });

        const head = dom.window.document.querySelector("head");

        if (!head) {
          logger.error("No head element found in index.html");
          process.exit(1);
        }

        // Add Tailwind CSS
        if (!process.env.DISABLE_TAILWIND) {
          logger.warnOnce(chalk.gray("render: adding tailwind"));
          const style = dom.window.document.createElement("style");
          style.textContent = `@import "@enpage/style-system/tailwind.css";`;
          head.appendChild(style);
        }

        // Enpage styles
        logger.warnOnce(chalk.gray("render: adding enpage styles"));
        const enpageStyles = dom.window.document.createElement("style");
        enpageStyles.textContent = `@import "@enpage/style-system/client.css";`;
        head.appendChild(enpageStyles);

        // Add the vite preload error script (to reload the page on preload error)
        const vitePreloadErrorScript = dom.window.document.createElement("script");
        vitePreloadErrorScript.textContent = `
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
        `;
        head.appendChild(vitePreloadErrorScript);

        // ----------------------------------------------------
        // Add meta tags if they don't exist

        // Charset
        if (!dom.window.document.querySelector("meta[charset]")) {
          logger.warnOnce(chalk.gray("render: adding charset meta tag"));
          const metaCharset = dom.window.document.createElement("meta");
          metaCharset.setAttribute("charset", "UTF-8");
          head.appendChild(metaCharset);
        }

        // title
        if (!dom.window.document.querySelector("title") && ctx?.attributes?.$siteTitle) {
          logger.warnOnce(chalk.gray("render: adding title tag"));
          const title = dom.window.document.createElement("title");
          title.textContent = ctx.attributes.$siteTitle.value;
          head.appendChild(title);
        }

        // description
        if (
          !dom.window.document.querySelector("meta[name='description']") &&
          ctx?.attributes?.$siteDescription?.value
        ) {
          logger.warnOnce(chalk.gray("render: adding description meta tag"));
          const metaDescription = dom.window.document.createElement("meta");
          metaDescription.setAttribute("name", "description");
          metaDescription.setAttribute("content", ctx.attributes.$siteDescription.value);
          head.appendChild(metaDescription);
        }

        // keywords
        if (!dom.window.document.querySelector("meta[name='keywords']") && ctx?.attributes.$siteKeywords?.value) {
          logger.warnOnce(chalk.gray("render: adding keywords meta tag"));
          const metaKeywords = dom.window.document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          metaKeywords.setAttribute("content", ctx.attributes.$siteKeywords.value);
          head?.appendChild(metaKeywords);
        }

        // viewport
        if (!dom.window.document.querySelector("meta[name='viewport']")) {
          logger.warnOnce(chalk.gray("render: adding viewport meta tag"));
          const metaViewport = dom.window.document.createElement("meta");
          metaViewport.setAttribute("name", "viewport");
          metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
          head?.appendChild(metaViewport);
        }

        // Add enpage web components
        // const enpageComponentsScript = dom.window.document.createElement("script");
        // enpageComponentsScript.type = "module";
        // enpageComponentsScript.textContent = `import "@enpage/sdk/web-components";`;
        // head?.appendChild(enpageComponentsScript);
        // Hide all sections but the first one
        const sections = dom.window.document.querySelectorAll("body > section");
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
          }
        });

        // ----------------------------------------------------
        // Add enpage SDK script
        const enpageSdkScript = dom.window.document.createElement("script");
        enpageSdkScript.type = "module";
        enpageSdkScript.textContent = `
          import { EnpageSDK } from "@enpage/sdk";
          window.enpage = new EnpageSDK(${ctx ? JSON.stringify(ctx) : "null"}, ${JSON.stringify(slugs)});
        `;
        head.appendChild(enpageSdkScript);

        // if not in SSR mode, add liquid js
        if (!isSsrBuild) {
          const liquidScript = dom.window.document.createElement("script");
          liquidScript.type = "module";
          // resolved through alias in vite.config.ts
          liquidScript.textContent = `import "@enpage/liquid";`;
          head.appendChild(liquidScript);

          // add script from @enpage/sdk/client-render
          const clientRenderScript = dom.window.document.createElement("script");
          clientRenderScript.type = "module";
          clientRenderScript.textContent = `
            import { renderOnClient } from "@enpage/sdk/client-render";
            renderOnClient();
            window.enpage.addEventListener("afternavigate", renderOnClient);
          `;
          head.appendChild(clientRenderScript);
          html = dom.serialize();
        } else {
          logger.info("SSR: rendering liquid templates");
          html = await renderLiquid(dom.serialize(), ctx, cfg);
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

function renderLiquid(html: string, ctx: PageContext<any, any> | undefined, cfg: EnpageTemplateConfig) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
