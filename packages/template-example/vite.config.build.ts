import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { vanillaExtractPlugin as veEsbuildPlugin } from "@vanilla-extract/esbuild-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import prerender from "@prerenderer/rollup-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vanillaExtractPlugin(),
    react(),
    visualizer({ emitFile: true }) as PluginOption,
    // prerender({
    //   // renderer: "@prerenderer/renderer-jsdom",
    //   renderer: "@prerenderer/renderer-puppeteer",
    //   // Required - The path to the vite-outputted app to prerender.
    //   // staticDir: join(__dirname, "dist"),
    //   // Required - Routes to render.
    //   routes: ["/"],
    // }),
  ],

  build: {
    minify: true,
    cssMinify: true,
    cssCodeSplit: true,
    rollupOptions: {
      // input: {
      //   main: resolve(__dirname, "index.html"),
      // },
      external: [
        // "zod",
        // "react",
        // "react/jsx-runtime",
        // "react-dom",
        // "@enpage/sdk",
      ],
      output: {
        manualChunks: {
          sdk: ["@enpage/sdk"],
          stylesystem: ["@enpage/style-system"],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [veEsbuildPlugin({ runtime: true })],
    },
  },
});
