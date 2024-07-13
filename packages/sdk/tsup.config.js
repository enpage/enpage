import { readFileSync } from "fs";
import { defineConfig } from "tsup";

const bannerText = readFileSync("./banner.txt", "utf-8");
const banner = {
  js: bannerText,
  css: bannerText,
};

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node"],
      outDir: "dist/node",
      target: "node18",
      format: ["esm"],
      dts: false,
      minify: !options.watch,
      metafile: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      splitting: false,
      external: ["zod", "tailwindcss", "jsdom", "vite", "vite-tsconfig-paths", "@enpage/style-system"],
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
    // The dev-client uses Vite's import.meta.env.DEV
    // We bundle it using tsup to avoid the automatic replacement at build time
    {
      entry: ["src/browser"],
      outDir: "dist/browser",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: ["zod", "tailwindcss", "jsdom", "vite", "vite-tsconfig-paths", "@enpage/style-system"],
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
    {
      entry: ["src/shared"],
      outDir: "dist/shared",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: ["zod", "tailwindcss", "jsdom", "vite", "vite-tsconfig-paths", "@enpage/style-system"],
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
  ];
});
