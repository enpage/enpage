import type { EnpageTemplateConfig } from "@enpage/types/config";
import { JSDOM, VirtualConsole } from "jsdom";
import type { Plugin } from "vite";
import type { PageContext } from "@enpage/types/context";

export const addTemplateDeps = (cfg: EnpageTemplateConfig, ctx: PageContext<any, any>): Plugin => {
  let isBuildMode = false;

  return {
    name: "enpage-add-template-deps",
    configResolved(config) {
      isBuildMode = config.command === "build";
    },
    transformIndexHtml: {
      order: "pre" as const,
      handler: async (html: string) => {
        const SSR = process.env.ENPAGE_SSR === "true";

        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        const dom = new JSDOM(html, { virtualConsole });

        const head = dom.window.document.querySelector("head");

        // Add Tailwind CSS
        if (!process.env.DISABLE_TAILWIND) {
          const style = dom.window.document.createElement("style");
          style.textContent = `@import "@enpage/style-system/tailwind.css";`;
          head?.appendChild(style);
        }

        // Add the vite preload error script (to reload the page on preload error)
        const vitePreloadErrorScript = dom.window.document.createElement("script");
        vitePreloadErrorScript.textContent = `
          window.addEventListener("vite:preloadError", (event) => {
            window.location.reload();
          });
        `;
        head?.appendChild(vitePreloadErrorScript);

        // ----------------------------------------------------
        // Add meta tags if they don't exist

        // Charset
        if (!dom.window.document.querySelector("meta[charset]")) {
          const metaCharset = dom.window.document.createElement("meta");
          metaCharset.setAttribute("charset", "UTF-8");
          head?.appendChild(metaCharset);
        }

        // title
        if (!dom.window.document.querySelector("title") && cfg?.attributes?.$pageTitle) {
          const title = dom.window.document.createElement("title");
          title.textContent = ctx.attributes.$pageTitle.value;
          head?.appendChild(title);
        }

        // description
        if (
          !dom.window.document.querySelector("meta[name='description']") &&
          ctx?.attributes?.$pageDescription?.value
        ) {
          const metaDescription = dom.window.document.createElement("meta");
          metaDescription.setAttribute("name", "description");
          metaDescription.setAttribute("content", ctx.attributes.$pageDescription.value);
          head?.appendChild(metaDescription);
        }

        // keywords
        if (!dom.window.document.querySelector("meta[name='keywords']") && ctx.attributes.$pageKeywords?.value) {
          const metaKeywords = dom.window.document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          metaKeywords.setAttribute("content", ctx.attributes.$pageKeywords.value);
          head?.appendChild(metaKeywords);
        }

        // viewport
        if (!dom.window.document.querySelector("meta[name='viewport']")) {
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

        // ----------------------------------------------------
        // Add enpage SDK script
        const enpageSdkScript = dom.window.document.createElement("script");
        enpageSdkScript.type = "module";
        enpageSdkScript.textContent = `
          import { EnpageSDK } from "@enpage/sdk";
          window.enpage = new EnpageSDK(${ctx ? JSON.stringify(ctx) : "null"});
        `;
        head?.appendChild(enpageSdkScript);

        // if not in SSR mode, add liquid js
        if (!SSR) {
          const liquidScript = dom.window.document.createElement("script");
          liquidScript.type = "module";
          // resolved through alias in vite.config.ts
          liquidScript.textContent = `import "@enpage/liquid";`;
          head?.appendChild(liquidScript);

          // add script from @enpage/sdk/client-render
          const clientRenderScript = dom.window.document.createElement("script");
          clientRenderScript.type = "module";
          clientRenderScript.textContent = `
            import { renderOnClient } from "@enpage/sdk/client-render";
            renderOnClient();
          `;
          head?.appendChild(clientRenderScript);
        }

        return dom.serialize();
      },
    },
  };
};
