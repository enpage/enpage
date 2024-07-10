import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src"],
    // entry: ["src", "!src/config/postcss.config.cjs"],
    format: ["esm"],
    // format: ["esm", "cjs"],
    dts: false,
    clean: true,
    minify: !options.watch,
    external: ["vite", "vite-tsconfig-paths", "@vitejs/plugin-react", "@enpage/style-system"],
  };
});
