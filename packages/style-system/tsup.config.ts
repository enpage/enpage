import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: ["esm"],
    clean: !options.watch,
    minify: !options.watch,
    bundle: false,
    dts: true,
    splitting: false,
    target: "esnext",
    external: ["zod", "stripe"],
  };
});
