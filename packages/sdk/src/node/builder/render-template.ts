import type { EnpageTemplateConfig } from "~/shared/config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { Logger, Plugin } from "vite";
import type { SiteContext } from "~/shared/context";
import { Liquid } from "liquidjs";
import { minify } from "html-minifier";
import { createFakeContext, fetchContext } from "./context";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { version } from "../../../package.json";

export const renderTemplate = (cfg: EnpageTemplateConfig): Plugin => {
  let isBuildMode = false;
  let isSsrBuild = false;
  let logger: Logger;
  let serverHostname = process.env.ENPAGE_SITE_HOST;

  return {
    name: "enpage:render",
    configResolved(config) {
      isBuildMode = config.command === "build";
      logger = config.logger;
    },
    config(_, env) {
      isSsrBuild = !!env.isSsrBuild;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        serverHostname = req.headers.host;
        next();
      });
    },
    transformIndexHtml: {
      order: "pre" as const,
      handler: async (html: string, viteCtx) => {
        let context = isBuildMode ? await fetchContext(cfg, logger) : createFakeContext(cfg, logger);
        if (context === false) {
          logger.error("Failed to fetch context. Using fake context instead.");
          context = createFakeContext(cfg, logger);
        }

        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const attrs = (context as SiteContext<any, any>).attributes;
        const dom = new JSDOM(html, { virtualConsole });
        const doc = dom.window.document;
        const head = doc.querySelector("head");

        if (!head) {
          logger.error("No head element found in index.html");
          process.exit(1);
        }

        // Add Tailwind CSS
        if (cfg.settings.disableTailwind) {
          logger.warnOnce(chalk.gray("render: tailwind is disabled"), {
            timestamp: true,
          });
        } else {
          const style = doc.createElement("style");
          style.textContent = `@import "@enpage/style-system/tailwind.css";`;
          head.appendChild(style);
        }

        // Enpage styles
        const enpageStyles = doc.createElement("style");
        enpageStyles.textContent = '@import "@enpage/style-system/client.css";';
        head.appendChild(enpageStyles);

        // animate.css
        const animateStyles = doc.createElement("style");
        animateStyles.textContent = '@import "@enpage/style-system/anim.css";';
        head.appendChild(animateStyles);

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

        // add base if not build
        if (!isBuildMode) {
          const base = doc.createElement("base");
          base.href = `http://${serverHostname}`;
          head.prepend(base);
        }

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
        if (!doc.querySelector("meta[name='keywords']") && context?.attributes.$siteKeywords) {
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

        // revised date
        const revised = doc.createElement("meta");
        revised.setAttribute("name", "revised");
        revised.setAttribute("content", new Date().toISOString());
        head?.appendChild(revised);

        // Hide sections when needed
        const sections = doc.querySelectorAll("body > section");

        if (!sections.length) {
          throw Error("No sections found in the document");
        }

        const slugs: string[] = [];
        sections.forEach((section, index) => {
          section.setAttribute("ep-label", `Page ${index + 1}`);
          if (!section.getAttribute("id")) {
            section.setAttribute("id", nanoid(7));
          }
          if (!section.getAttribute("ep-animate-appear")) {
            section.setAttribute("ep-animate-appear", "fadeIn");
          }
          if (!section.getAttribute("ep-animate-disappear")) {
            section.setAttribute("ep-animate-disappear", "fadeOut");
          }
          // add [ep-editable] if not present
          if (!section.getAttribute("ep-editable")) {
            section.setAttribute("ep-editable", "");
          }
          // hide all sections except the first one
          if (index > 0) {
            section.setAttribute("hidden", "");
            let slug = section.getAttribute("ep-slug");
            if (!slug) {
              slug = nanoid(7);
              section.setAttribute("ep-slug", slug);
            }
            slugs.push(slug);
          } else {
            // make sure the first section has role="main"
            section.setAttribute("role", "main");
            // make sure the first section has no slug
            section.removeAttribute("ep-slug");
            // hide it by default if it as an animation
            if (section.hasAttribute("ep-animate-appear")) {
              section.setAttribute("hidden", "");
            }
          }
        });

        // rerwrite stadalone <img> tags to <picture> tags
        const images = doc.querySelectorAll("img");
        images.forEach((img) => {
          // check if the image is standalone
          if (img.parentElement?.tagName !== "picture") {
            const picture = doc.createElement("picture");
            img.parentNode?.replaceChild(picture, img);
            // copy all attributes except src
            for (let i = 0; i < img.attributes.length; i++) {
              const attr = img.attributes[i];
              if (attr.name !== "src") {
                picture.setAttribute(attr.name, attr.value);
                img.removeAttribute(attr.name);
              }
            }
            picture.appendChild(img);
          }
        });

        // set body attributes ep-block-type="page" and ep-editable, ep-label
        if (!cfg.settings.disableBodyCustomization) {
          const body = doc.querySelector("body") as HTMLBodyElement;
          body.setAttribute("ep-block-type", "site-background");
          body.setAttribute("ep-editable", "");
          body.setAttribute("ep-label", "Background");
        }

        // for all editable elements ([ep-editable]), add a ep-label attribute if not present
        // the label will describe the tag
        const editableElements = doc.querySelectorAll("[ep-editable]");
        editableElements.forEach((el) => {
          if (!el.getAttribute("ep-label")) {
            el.setAttribute("ep-label", el.tagName.toLowerCase());
          }
        });

        // ----------------------------------------------------
        // Add enpage SDK script
        const enpageSdkScript = doc.createElement("script");
        enpageSdkScript.type = "module";
        enpageSdkScript.textContent = `
          import { EnpageJavascriptAPI } from "@enpage/sdk/browser/js-api";
          const slugs =  ${JSON.stringify(slugs)};
          const pathname = window.location.pathname.slice(1);
          const pageId = pathname === '' ? 0 : slugs.indexOf(pathname);
          window.enpage = new EnpageJavascriptAPI(
            ${context ? JSON.stringify(context) : "null"},
            pageId > -1 ? pageId : 0,
            ${sections.length},
            ${JSON.stringify(slugs)}
          );
        `;
        head.appendChild(enpageSdkScript);

        // add custom elements
        const customElementsScript = doc.createElement("script");
        customElementsScript.type = "module";
        customElementsScript.textContent = `
          import "@enpage/sdk/browser/components/directives/all";
          import "@enpage/sdk/browser/components/blocks/all";
        `;
        head.appendChild(customElementsScript);

        // add animate script
        const animateScript = doc.createElement("script");
        animateScript.type = "module";
        animateScript.textContent = 'import "@enpage/sdk/browser/animate";';
        head.appendChild(animateScript);

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
          html = await renderLiquid(dom.serialize(), context);
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

// biome-ignore lint/suspicious/noExplicitAny: we don't know the type of the context
function renderLiquid(html: string, ctx: SiteContext<any, any> | undefined) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
