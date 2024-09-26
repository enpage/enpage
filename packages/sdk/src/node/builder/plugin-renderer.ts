import type { EnpageTemplateConfig } from "~/shared/template-config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { ConfigEnv, Logger, Plugin } from "vite";
import type { GenericPageContext } from "~/shared/page-config";
import { version } from "../../../package.json";
import invariant from "~/shared/utils/invariant";
import type { EnpageEnv } from "~/shared/env";
import { getPageSections, processPageSections } from "../../browser/page-sections";
import { store } from "./store";

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
  const isDevMode = viteEnv.command === "serve";
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
      handler: async (html: string, ctx) => {
        const context = enpageCtx;
        const { head, doc, body, dom } = createJSDOM(html);

        invariant(head, "No head element found in index.html");
        invariant(body, "No body element found in index.html");

        // ----------------------------
        // [always] Always there
        addStatePlaceholderScript(doc, head);
        // Add the Enpage SDK entry client script
        addEntryClient(doc, head, body);
        // Set site language. Will result in <html lang="xx">
        renderMetaTags(doc, head, context);
        // Add stylesheets to the document head
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

        if (isDevMode) addDevClient(doc, head);

        // Hide sections when needed
        const sections = getPageSections(doc);
        const { slugs } = processPageSections(sections);
        store.set("slugs", slugs);

        return dom.serialize();
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

  // disable JSDOM errors otherwise we'll get a lot of noise
  // for things like CSS imports or other new CSS features
  // not recognized by JSDOM
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const dom = new JSDOM(html, { virtualConsole });
  const doc = dom.window.document;
  const head = doc.querySelector("head") as HTMLHeadElement;
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
  const setElAttributes = (el: Element, attributes: Record<string, string>) => {
    for (const key in attributes) {
      if (key === "innerText") {
        el.textContent = attributes[key];
      } else if (key === "innerHTML") {
        el.innerHTML = attributes[key];
      } else {
        el.setAttribute(key, attributes[key]);
      }
    }
  };
  let el = parent.querySelector(selector);
  if (!el) {
    el = doc.createElement(tagName);
    setElAttributes(el, attributes);
    parent.appendChild(el);
  } else {
    setElAttributes(el, attributes);
  }
}

/**
 * Add/update meta tags to the document head.
 */
function renderMetaTags(doc: Document, head: HTMLHeadElement, context: GenericPageContext | undefined) {
  if (context?.attr.$siteLanguage) {
    doc.documentElement.lang = context?.attr.$siteLanguage;
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
  if (context?.attr.$siteTitle)
    upsertHtmlElement("title", "title", doc, head, { innerText: context.attr.$siteTitle });

  // description (always update)
  if (context?.attr.$siteDescription)
    upsertHtmlElement("meta", "meta[name='description']", doc, head, {
      name: "description",
      content: context.attr.$siteDescription,
    });

  // keywords (always update)
  if (context?.attr.$siteKeywords) {
    upsertHtmlElement("meta", "meta[name='keywords']", doc, head, {
      name: "keywords",
      content: context.attr.$siteKeywords,
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
