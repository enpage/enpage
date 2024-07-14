// vite.config.ts
import { defineConfig } from "vite";
import { extractStyles } from "./html-style-extractor";
import fs from "fs/promises";
import { JSDOM } from "jsdom";

export default defineConfig({
  plugins: [
    {
      name: "html-css-processor",
      transformIndexHtml: {
        enforce: "pre",
        async transform(html) {
          const styles = extractStyles(html);

          // Write styles to a temporary file
          await fs.writeFile(
            "temp-styles.css",
            styles
              .map((s) => {
                if (s.selector === "@import") {
                  return s.styles; // Keep @import statements as is
                }
                return `${s.selector} { ${s.styles} }`;
              })
              .join("\n"),
          );

          // Remove all style tags, inline styles, and stylesheet links from HTML using jsdom
          const dom = new JSDOM(html);
          const { document } = dom.window;

          // Remove style tags
          document.querySelectorAll("style").forEach((el) => el.remove());

          // Remove inline styles
          document.querySelectorAll("*[style]").forEach((el) => el.removeAttribute("style"));

          // Remove stylesheet links
          document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());

          return dom.serialize();
        },
      },
    },
    {
      name: "inject-css-back",
      transformIndexHtml: {
        enforce: "post",
        transform(html) {
          const dom = new JSDOM(html);
          const { document } = dom.window;

          // Inject the processed CSS file
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "/main.css"; // Adjust this path if necessary
          document.head.appendChild(link);

          return dom.serialize();
        },
      },
    },
  ],
  css: {
    postcss: "./postcss.config.js",
  },
});
