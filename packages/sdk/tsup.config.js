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

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node", "!src/node/**/*.md", "!src/node/**/__tests__/**/*", "!src/node/**/__mocks__/**/*"],
      outDir: "dist/node",
      target: "node18",
      format: ["esm"],
      dts: true,
      minify: !options.watch,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      sourcemap: options.watch ? "inline" : false,
      splitting: false,
      external: [
        "zod",
        "tailwindcss",
        "jsdom",
        "vite",
        "@vitejs/plugin-react",
        "vite-plugin-inspect",
        "vite-tsconfig-paths",
        "@enpage/style-system",
        "axe-core",
        "virtual:enpage-template:index.html",
        "virtual:enpage-page-config.json",
      ],
      // Force bundling of lodash-es for the CLI
      noExternal: ["lodash-es"],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
    // The dev-client uses Vite's import.meta.env.DEV
    // We bundle it using tsup to avoid the automatic replacement at build time
    {
      entry: [
        "src/browser",
        "!src/browser/**/*.md",
        "!src/browser/**/__tests__/**/*",
        "!src/browser/**/__mocks__/**/*",
      ],
      outDir: "dist/browser",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: [
        "zod",
        "tailwindcss",
        "jsdom",
        "vite",
        "vite-tsconfig-paths",
        "@enpage/style-system",
        "postcss",
        "autoprefixer",
      ],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
    {
      entry: [
        "src/shared",
        "!src/shared/**/*.md",
        "!src/shared/**/__tests__/**/*",
        "!src/shared/**/__mocks__/**/*",
      ],
      outDir: "dist/shared",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: [
        "zod",
        "tailwindcss",
        "jsdom",
        "vite",
        "vite-tsconfig-paths",
        "@enpage/style-system",
        "virtual:enpage-template:index.html",
        "virtual:enpage-page-config.json",
      ],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
    {
      entry: ["src/server/node/dev-server.ts"],
      outDir: "dist/server/node",
      target: "node18",
      format: ["esm"],
      dts: false,
      minify: !options.watch,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      sourcemap: options.watch ? "inline" : false,
      splitting: false,
      external: ["vite", "virtual:enpage-template:index.html", "virtual:enpage-page-config.json"],
      clean: true,
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
    {
      entry: ["src/server/cloudflare/server.ts"],
      outDir: "dist/server/cloudflare",
      target: "es2020",
      format: ["esm"],
      dts: false,
      clean: true,
      splitting: false,
      metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: [
        "__STATIC_CONTENT_MANIFEST",
        "vite",
        "virtual:enpage-template:index.html",
        "virtual:enpage-page-config.json",
      ],
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
  ];
});
