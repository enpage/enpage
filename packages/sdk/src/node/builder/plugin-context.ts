import type { Plugin } from "vite";
import type { GenericPageContext } from "~/shared/page-config";

/**
 * Set the page context for other plugins to use
 */
export const contextPlugin = (ctx: GenericPageContext | null): Plugin => {
  return {
    name: "enpage:context",
    // enforce: "pre",
    async config(config) {
      // @ts-expect-error
      config.enpageContext = ctx;
    },
  };
};
