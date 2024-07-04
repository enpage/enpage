import { minify } from "html-minifier";
import type { Plugin } from "vite";

export const minifyHtml = (): Plugin => {
  let isBuildMode = false;

  return {
    name: "enpage-minify-html",
    configResolved(config) {
      isBuildMode = config.command === "build";
    },
    transformIndexHtml: {
      handler: (html: string) => {
        if (!isBuildMode) {
          return html;
        }
        return minify(html, {
          removeComments: true,
          collapseWhitespace: true,
          ignoreCustomComments: [],
          minifyJS: true,
        }) as string;
      },
    },
  };
};
