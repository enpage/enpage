import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: ["esm"],
    clean: !options.watch,
    minify: !options.watch,
    target: "node20",
    external: ["zod", "stripe"],
  };
});
