import { resolve as resolvePackage } from "import-meta-resolve";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const openPropsPath = dirname(fileURLToPath(resolvePackage("open-props", import.meta.url)));

export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},

    ...(process.env.NODE_ENV === "production"
      ? {
          "@fullhuman/postcss-purgecss": {
            content: ["index.html", "src/**/*.{js,ts,css,html}"],
          },
          cssnano: {},
        }
      : {}),
  },
};
