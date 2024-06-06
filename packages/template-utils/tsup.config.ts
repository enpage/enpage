import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/vite-plugin.ts", "src/demo/index.tsx"],
    format: ["esm"],
    dts: true,
    clean: true,
    minify: !options.watch,
    external: [
      "vite",
      "vite-tsconfig-paths",
      "@vitejs/plugin-react",
      "@enpage/style-system",
      "virtual:enpage-template",
      "react-icons",
      "react",
      "react-dom",
    ],
  };
});
