import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const bannerText = readFileSync("../../banner.txt", "utf-8");
const banner = {
  js: bannerText,
  css: bannerText,
};

const loader = {
  ".html": "copy",
};

const external = [
  // "zod",
  // "tailwindcss",
  // "jsdom",
  "vite",
  "vite-plugin-inspect",
  "@vitejs/plugin-react",
  // "vite-tsconfig-paths",
  // "postcss",
  // "postcss-preset-env",
  // "cssnano",
  // "autoprefixer",
  // "@fullhuman/postcss-purgecss",

  // "@twind/core",
  // "@twind/with-react",
  // "@twind/preset-autoprefix",
  // "@twind/preset-ext",
  // "@twind/preset-line-clamp",
  // "@twind/preset-tailwind",
  // "@twind/preset-tailwind-forms",
  // "@twind/preset-typography",

  // "axe-core",
  "react",
  "react-dom",

  "react-resizable",

  "fsevents",
  "lightningcss",
  "virtual:enpage-page-config.json",
  "__STATIC_CONTENT_MANIFEST",
];

const ignored = [
  "!**/*.md",
  "!**/tests/**/*",
  "!**/sample.ts",
  // test
  "!**/hooks/**/*",
  "!**/node/cli/commands/**/*",
  "!**/shared/bricks/**/*",
];

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node", ...ignored],
      outDir: "dist/node",
      target: "node20.10",
      format: ["esm"],
      dts: false,
      clean: !options.watch,
      minify: !options.watch,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      sourcemap: options.watch ? "inline" : false,
      // Important: force splitting to false to avoid issues with dynamic imports and __dirname resolutions
      splitting: false,
      external,
      // Force bundling of lodash-es for the CLI
      noExternal: ["lodash-es"],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
      removeNodeProtocol: false,
    },
    {
      entry: ["src/shared", ...ignored],
      outDir: "dist/shared",
      target: "es2020",
      format: ["esm"],
      dts: {
        compilerOptions: {
          exclude: ignored,
        },
      },
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      clean: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      // splitting: false,
      external,
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
      removeNodeProtocol: false,
    },
  ];
});
