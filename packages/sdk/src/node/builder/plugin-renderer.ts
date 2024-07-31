import type { EnpageTemplateConfig } from "~/shared/template-config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { ConfigEnv, Logger, Plugin } from "vite";
import type { GenericPageContext, PageContext } from "~/shared/page-context";
import { Liquid } from "liquidjs";
import { minify } from "html-minifier";
import { nanoid } from "nanoid";
import { version } from "../../../package.json";
import type { AttributesResolved } from "~/shared/attributes";
import invariant from "tiny-invariant";
import type { EnpageEnv } from "~/shared/env";

/**
 * Renders the template based on the provided configuration and Vite environment.
 * @param {EnpageTemplateConfig} cfg - The Enpage template configuration.
 * @param {ConfigEnv} viteEnv - The Vite environment configuration.
 */
export const renderTemplatePlugin = (
  cfg: EnpageTemplateConfig,
  viteEnv: ConfigEnv,
  env: EnpageEnv,
): Plugin => {
  const isBuildMode = viteEnv.command === "build";
  const envMode = viteEnv.mode;
  let logger: Logger;

  let serverHostname = process.env.ENPAGE_SITE_HOST;
  let enpageCtx: GenericPageContext | undefined;

  return {
    name: "enpage:render",
    configResolved(config) {
      logger = config.logger;
      // @ts-ignore
      enpageCtx = config.enpageContext;
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
        const context = enpageCtx;

        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const { head, doc, body, dom } = createJSDOM(html);

        invariant(head, "No head element found in index.html");
        invariant(body, "No body element found in index.html");

        // ----------------------------
        // [always] Always there
        addStatePlaceholderScript(doc, head);
        // Set site language. Will result in <html lang="xx">
        renderMetaTags(doc, head, context);

        // ----------------------------
        // [build-only] Add stylesheets to the document head
        if (isBuildMode) {
          addStylesheets(cfg, logger, doc, head);
          // Add the vite preload error script (to reload the page on preload error)
          attachVitePreloadErrorScript(doc, head);
          // rerwrite stadalone <img> tags to <picture> tags
          rewriteImageTags(doc);
          // set body attributes ep-block-type="page" and ep-editable, ep-label
          processBody(cfg, body);
          // for all editable elements ([ep-editable]), add a ep-label attribute if not present
          // the label will describe the tag
          addMissingLabels(doc);
          // add custom elements
          addCustomElements(doc, head);
          // add animate script
          addAnimationScript(doc, head);

          // ----------------------------
          // [dev only]
        } else {
          addDevClient(doc, head);
        }

        // Hide sections when needed
        const sections = getPageSections(doc);
        const { slugs } = processPageSections(sections);

        // if (isSsrBuild) {
        //   logger.info("SSR: rendering liquid templates");
        //   html = await renderLiquid(dom.serialize(), context);
        // }
        if (!isBuildMode) {
          return dom.serialize();
        } else {
          logger.info("render: Minifying HTML", { timestamp: true });
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

function addStatePlaceholderScript(doc: Document, head: HTMLHeadElement) {
  const stateScript = doc.createElement("script");
  stateScript.id = "enpage-state";
  stateScript.textContent = `/* ENPAGE_STATE_PLACEHOLDER_DONT_REMOVE */`;
  head.appendChild(stateScript);
}

function addEntryClient(doc: Document, head: HTMLHeadElement, body: HTMLBodyElement) {
  const entryClient = doc.createElement("script");
  entryClient.type = "module";
  entryClient.id = "enpage-sdk";
  entryClient.textContent = `import "@enpage/sdk/browser/vite-entry-client";`;
  head.appendChild(entryClient);
}

function addDevClient(doc: Document, head: HTMLHeadElement) {
  const devClientScript = doc.createElement("script");
  devClientScript.type = "module";
  devClientScript.textContent = `import { initDevClient } from "@enpage/sdk/browser/dev-client";
initDevClient();
window.enpage.addEventListener("afternavigate", initDevClient);`;
  head.appendChild(devClientScript);
}

/**
 * Creates a JSDOM instance from the provided HTML.
 * @param {string} html - The HTML string to create the JSDOM from.
 */
function createJSDOM(html: string) {
  const virtualConsole = new VirtualConsole();
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const dom = new JSDOM(html, { virtualConsole });
  const doc = dom.window.document;
  const head = doc.querySelector("head");
  const body = doc.querySelector("body") as HTMLBodyElement;
  return { head, doc, body, dom };
}

/**
 * Processes the body element, setting custom attributes.
 * @param {EnpageTemplateConfig} cfg - The Enpage template configuration.
 * @param {HTMLBodyElement} body - The body element to process.
 */
function processBody(cfg: EnpageTemplateConfig, body: HTMLBodyElement) {
  if (!cfg.manifest.settings?.disableBodyCustomization) {
    body.setAttribute("ep-block-type", "site-background");
    body.setAttribute("ep-editable", "");
    body.setAttribute("ep-label", "Background");
  }
}

/**
 * Retrieves all page sections from the document.
 * @param {Document} doc - The document to search for sections.
 */
function getPageSections(doc: Document) {
  const sections = doc.querySelectorAll("body > section");
  if (!sections.length) {
    throw Error("No sections found in the document");
  }
  return sections;
}

/**
 * Processes page sections, setting attributes and generating slugs.
 * @param {NodeListOf<Element>} sections - The list of section elements to process.
 */
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

/**
 * Adds the animation script to the document head.
 * @param {Document} doc - The document to modify.
 * @param {HTMLHeadElement} head - The head element to append the script to.
 */
function addAnimationScript(doc: Document, head: HTMLHeadElement) {
  const animateScript = doc.createElement("script");
  animateScript.type = "module";
  animateScript.textContent = 'import "@enpage/sdk/browser/animate";';
  head.appendChild(animateScript);
}

/**
 * Adds custom elements scripts to the document head.
 * @param {Document} doc - The document to modify.
 * @param {HTMLHeadElement} head - The head element to append the script to.
 */
function addCustomElements(doc: Document, head: HTMLHeadElement) {
  const customElementsScript = doc.createElement("script");
  customElementsScript.type = "module";
  customElementsScript.textContent = `
          import "@enpage/sdk/browser/components/directives/all";
          import "@enpage/sdk/browser/components/blocks/all";
        `;
  head.appendChild(customElementsScript);
}

/**
 * Rewrites standalone image tags to picture tags.
 * @param {Document} doc - The document to modify.
 */
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

/**
 * Adds missing labels to editable elements.
 * @param {Document} doc - The document to modify.
 */
function addMissingLabels(doc: Document) {
  doc.querySelectorAll("[ep-editable]").forEach((el) => {
    if (!el.getAttribute("ep-label")) {
      el.setAttribute("ep-label", el.tagName.toLowerCase());
    }
  });
}

/**
 * Adds the Enpage SDK script to the document head.
 * @param {Document} doc - The document to modify.
 * @param {string[]} slugs - The list of slugs for the pages.
 * @param {PageContext<any, any>} context - The page context.
 * @param {NodeListOf<Element>} sections - The list of page sections.
 * @param {HTMLHeadElement} head - The head element to append the script to.
 */
function addEnpageSdkScriptDev(
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

/**
 * Attaches the Vite preload error script to the document head.
 * @param {Document} doc - The document to modify.
 * @param {HTMLHeadElement} head - The head element to append the script to.
 */
function attachVitePreloadErrorScript(doc: Document, head: HTMLHeadElement) {
  const vitePreloadErrorScript = doc.createElement("script");
  vitePreloadErrorScript.textContent = `
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
        `;
  head.appendChild(vitePreloadErrorScript);
}

function upsertHtmlElement(
  tagName: string,
  selector: string,
  doc: Document,
  parent: HTMLElement,
  attributes: Record<string, string>,
) {
  let el = parent.querySelector(selector);
  if (!el) {
    el = doc.createElement(tagName);
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    parent.appendChild(el);
  } else {
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  }
}

/**
 * Add/update meta tags to the document head.
 */
function renderMetaTags(doc: Document, head: HTMLHeadElement, context: GenericPageContext | undefined) {
  if (context?.attrs.$siteLanguage) {
    doc.documentElement.lang = context?.attrs.$siteLanguage;
  }
  // ----------------------------------------------------
  // Add meta tags if they don't exist
  // Charset
  if (!doc.querySelector("meta[charset]")) {
    const meta = doc.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    head.appendChild(meta);
  }

  // title (always update)
  if (context?.attrs.$siteTitle)
    upsertHtmlElement("title", "title", doc, head, { textContent: context.attrs.$siteTitle });

  // description (always update)
  if (context?.attrs.$siteDescription)
    upsertHtmlElement("meta", "meta[name='description']", doc, head, {
      name: "description",
      content: context.attrs.$siteDescription,
    });

  // keywords (always update)
  if (context?.attrs.$siteKeywords) {
    upsertHtmlElement("meta", "meta[name='keywords']", doc, head, {
      name: "keywords",
      content: context.attrs.$siteKeywords,
    });
  }

  // viewport
  if (!doc.querySelector("meta[name='viewport']")) {
    const meta = doc.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1.0");
    head?.appendChild(meta);
  }

  // generator (always update with current version)
  upsertHtmlElement("meta", "meta[name='generator']", doc, head, {
    name: "generator",
    content: `Enpage v${version}`,
  });

  // revised date (always update)
  upsertHtmlElement("meta", "meta[name='revised']", doc, head, {
    name: "revised",
    content: new Date().toISOString(),
  });
}

/**
 * Adds stylesheets to the document head.
 */
function addStylesheets(cfg: EnpageTemplateConfig, logger: Logger, doc: Document, head: HTMLHeadElement) {
  const styles = ["tailwind", "client", "anim"];
  for (const style of styles) {
    if (style === "tailwind" && cfg.manifest.settings?.disableTailwind) continue;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = `/@enpage/style-system/${style}.css`;
    head.appendChild(link);
  }
}

/**
 * @deprecated
 */
// biome-ignore lint/suspicious/noExplicitAny: we don't know the type of the context
function renderLiquid(html: string, ctx: PageContext<any, any> | undefined) {
  const engine = new Liquid();
  return engine.parseAndRender(html, ctx, {
    globals: ctx,
  });
}
