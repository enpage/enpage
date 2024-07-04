import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src"],
    format: ["esm"],
    dts: false,
    clean: true,
    minify: !options.watch,
    external: ["vite", "vite-tsconfig-paths", "@vitejs/plugin-react", "@enpage/style-system"],
  };
});
