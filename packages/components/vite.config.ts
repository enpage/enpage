import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";
import bundlesize from "vite-plugin-bundlesize";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  envPrefix: ["PUBLIC_"],
  base: "./",
  plugins: [
    tsconfigPaths() as PluginOption,
    Inspect(),
    react() as PluginOption,
    dts({
      include: [
        "src/editor/components/Editor.tsx",
        "src/editor/components/EditorWrapper.tsx",
        "src/editor/hooks/use-editor.ts",
        "src/shared/components/Page.tsx",
        "src/shared/components/Brick.tsx",
        "src/test-config.ts",
      ],
      outDir: "dist/types",
    }),
    bundlesize({
      limits: [{ name: "**/*", limit: "800 kB" }],
    }),
  ],
  optimizeDeps: {
    // include: ["@upstart.gg/sdk"],
  },
  server: {
    port: +(process.env.PORT ?? 3008),
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
    },
  },
  build: {
    copyPublicDir: false,
    sourcemap: process.env.NODE_ENV === "development" ? true : "hidden",
    lib: {
      entry: {
        Editor: "src/editor/components/Editor.tsx",
        EditorWrapper: "src/editor/components/EditorWrapper.tsx",
        Page: "src/shared/components/Page.tsx",
        Brick: "src/shared/components/Brick.tsx",
        "use-editor": "src/editor/hooks/use-editor.ts",
        "test-config": "src/test-config.ts",
      },
      formats: ["es"],
    },
    minify: process.env.NODE_ENV === "production" && process.env.NOMINIFY !== "1",
    cssMinify: false,
    rollupOptions: {
      external: [
        "react-icons",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@sinclair/typebox",
        "@upstart.gg/style-system",
        "@upstart.gg/sdk",
        "lodash-es",
        "lodash",
      ],
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
