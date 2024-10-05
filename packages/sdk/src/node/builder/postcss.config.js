import { resolve as resolvePackage } from "import-meta-resolve";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { features } from "node:process";

const openPropsPath = dirname(fileURLToPath(resolvePackage("open-props", import.meta.url)));

export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    // "postcss-jit-props": {
    //   files: [join(openPropsPath, "..", "open-props.min.css"), join(openPropsPath, "..", "buttons.min.css")],
    // },
    // "@csstools/postcss-global-data": {
    //   files: [join(openPropsPath, "..", "media.min.css")],
    // },
    // "postcss-custom-media": {},

    ...(process.env.DISABLE_TAILWIND ? {} : { tailwindcss: {} }),
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
