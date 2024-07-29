import type { EnpageTemplateConfig } from "~/shared/config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { ConfigEnv, Logger, Plugin } from "vite";
import type { PageContext } from "~/shared/context";
import { Liquid } from "liquidjs";
import { minify } from "html-minifier";
import { createFakeContext, fetchContext } from "./context";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { version } from "../../../package.json";
import type { AttributesResolved } from "~/shared/attributes";

export const renderTemplate = (cfg: EnpageTemplateConfig, viteEnv: ConfigEnv): Plugin => {
  const isBuildMode = viteEnv.command === "build";
  const isSsrBuild = viteEnv.isSsrBuild;
  let logger: Logger;

  let serverHostname = process.env.ENPAGE_SITE_HOST;

  return {
    name: "enpage:render",
    configResolved(config) {
      logger = config.logger;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        serverHostname = req.headers.host;
        next();
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler: async (html: string, viteCtx) => {
        let context = isBuildMode ? await fetchContext(cfg, logger) : createFakeContext(cfg, logger);
        if (context === false) {
          logger.error("Failed to fetch context. Using fake context instead.");
          context = createFakeContext(cfg, logger);
        }

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const attrs = (context as PageContext<any, any>).attributes;

        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const { head, doc, body, dom } = createJSDOM(html);

        if (!head) {
          logger.error("No head element found in index.html");
          process.exit(1);
        }

        // Add Tailwind CSS
        addStylesheets(cfg, logger, doc, head);

        // Add the vite preload error script (to reload the page on preload error)
        attachVitePreloadErrorScript(doc, head);

        // Set site language. Will result in <html lang="xx">
        addMetaTags(doc, attrs, head, context);

        // Hide sections when needed
        const sections = getPageSections(doc);
        const { slugs } = processPageSections(sections);

        // rerwrite stadalone <img> tags to <picture> tags
        rewriteImageTags(doc);

        // set body attributes ep-block-type="page" and ep-editable, ep-label
        processBody(cfg, body);

        // for all editable elements ([ep-editable]), add a ep-label attribute if not present
        // the label will describe the tag
        addMissingLabels(doc);

        // Add enpage SDK script
        addEnpageSdkScript(doc, slugs, context, sections, head);

        // add custom elements
        addCustomElements(doc, head);

        // add animate script
        addAnimationScript(doc, head);

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
        }

        // if (isSsrBuild) {
        //   logger.info("SSR: rendering liquid templates");
        //   html = await renderLiquid(dom.serialize(), context);
        // }
        if (!isBuildMode) {
          return dom.serialize();
        } else {
          logger.info("[render] Minifying HTML");
          return minify(dom.serialize(), {
            removeComments: true,
            collapseWhitespace: true,
            ignoreCustomComments: [],
          });
        }
      },
    },
  };
};

function createJSDOM(html: string) {
  const virtualConsole = new VirtualConsole();
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const dom = new JSDOM(html, { virtualConsole });
  const doc = dom.window.document;
  const head = doc.querySelector("head");
  const body = doc.querySelector("body") as HTMLBodyElement;
  return { head, doc, body, dom };
}

function processBody(cfg: EnpageTemplateConfig, body: HTMLBodyElement) {
  if (!cfg.manifest.settings?.disableBodyCustomization) {
    body.setAttribute("ep-block-type", "site-background");
    body.setAttribute("ep-editable", "");
    body.setAttribute("ep-label", "Background");
  }
}

function getPageSections(doc: Document) {
  const sections = doc.querySelectorAll("body > section");
  if (!sections.length) {
    throw Error("No sections found in the document");
  }
  return sections;
}

function processPageSections(sections: NodeListOf<Element>) {
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
  return { slugs };
}

function addAnimationScript(doc: Document, head: HTMLHeadElement) {
  const animateScript = doc.createElement("script");
  animateScript.type = "module";
  animateScript.textContent = 'import "@enpage/sdk/browser/animate";';
  head.appendChild(animateScript);
}

function addCustomElements(doc: Document, head: HTMLHeadElement) {
  const customElementsScript = doc.createElement("script");
  customElementsScript.type = "module";
  customElementsScript.textContent = `
          import "@enpage/sdk/browser/components/directives/all";
          import "@enpage/sdk/browser/components/blocks/all";
        `;
  head.appendChild(customElementsScript);
}

function rewriteImageTags(doc: Document) {
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
}

function addMissingLabels(doc: Document) {
  doc.querySelectorAll("[ep-editable]").forEach((el) => {
    if (!el.getAttribute("ep-label")) {
      el.setAttribute("ep-label", el.tagName.toLowerCase());
    }
  });
}

function addEnpageSdkScript(
  doc: Document,
  slugs: string[],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: PageContext<any, any> | undefined,
  sections: NodeListOf<Element>,
  head: HTMLHeadElement,
) {
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
}

function attachVitePreloadErrorScript(doc: Document, head: HTMLHeadElement) {
  const vitePreloadErrorScript = doc.createElement("script");
  vitePreloadErrorScript.textContent = `
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
        `;
  head.appendChild(vitePreloadErrorScript);
}

function addMetaTags(
  doc: Document,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  attrs: AttributesResolved<any>,
  head: HTMLHeadElement,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: PageContext<any, any> | undefined,
) {
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
}

function addStylesheets(cfg: EnpageTemplateConfig, logger: Logger, doc: Document, head: HTMLHeadElement) {
  if (cfg.manifest.settings?.disableTailwind) {
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
}

// biome-ignore lint/suspicious/noExplicitAny: we don't know the type of the context
function renderLiquid(html: string, ctx: PageContext<any, any> | undefined) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
