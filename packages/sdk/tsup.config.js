import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node"],
      outDir: "dist/node",
      target: "node18",
      format: ["esm"],
      dts: false,
      minify: !options.watch,
      splitting: false,
      external: ["vite", "@enpage/style-system"],
    },
    // The dev-client uses Vite's import.meta.env.DEV
    // We bundle it using tsup to avoid the automatic replacement at build time
    {
      entry: ["src/browser"],
      outDir: "dist/browser",
      target: "es2020",
      format: ["esm"],
      dts: true,
      minify: !options.watch,
      external: ["vite", "@enpage/style-system"],
    },
  ];
});
