import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src"],
    format: ["esm"],
    target: "node20",
    dts: false,
    clean: true,
    minify: !options.watch,
    sourcemap: true,
    bundle: true,
  };
});
