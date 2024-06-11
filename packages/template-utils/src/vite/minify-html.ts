import { minify } from "html-minifier";

export const minifyHtml = () => {
  return {
    name: "enpage-minify-html",
    transformIndexHtml: {
      handler: (html: string) => {
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
