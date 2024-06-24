import type { EnpageTemplateConfig } from "@enpage/types/config";
import { JSDOM, VirtualConsole } from "jsdom";

export const addTemplateDeps = (cfg: EnpageTemplateConfig | null) => {
  return {
    name: "enpage-add-template-deps",
    transformIndexHtml: {
      order: "pre" as const,
      handler: (html: string) => {
        // disable JSDOM errors otherwise we'll get a lot of noise
        // for things like CSS imports or other new CSS features
        // not recognized by JSDOM
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        const dom = new JSDOM(html, { virtualConsole });

        const head = dom.window.document.querySelector("head");

        // Add Tailwind CSS
        if (!cfg?.settings?.disableTailwind) {
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

        // Add enpage SDK script
        const enpageSdkScript = dom.window.document.createElement("script");
        enpageSdkScript.type = "module";
        enpageSdkScript.textContent = `
          import { EnpageSDK } from "@enpage/sdk";
          window.enpage = new EnpageSDK();
        `;
        head?.appendChild(enpageSdkScript);

        return dom.serialize();
      },
    },
  };
};
