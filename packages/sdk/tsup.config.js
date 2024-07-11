import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return [
    {
      entry: ["src/builder/node"],
      outDir: "dist/builder/node",
      target: "node18",
      format: ["esm"],
      dts: false,
      minify: !options.watch,
      external: ["vite", "@enpage/style-system"],
    },
    {
      entry: ["src/builder/client"],
      outDir: "dist/builder/client",
      target: "es2020",
      format: ["esm"],
      dts: false,
      minify: !options.watch,
      external: ["vite", "@enpage/style-system"],
    },
  ];
});
