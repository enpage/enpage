import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";
import bundlesize from "vite-plugin-bundlesize";

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ["PUBLIC_"],
  base: "./",
  plugins: [
    Inspect(),
    react() as PluginOption,
    dts({
      exclude: ["src/entry-client.tsx", "src/entry-server.tsx", "src/main.tsx", "src/App.tsx"],
    }),
    bundlesize({
      limits: [{ name: "**/*", limit: "800 kB" }],
    }),
  ],
  optimizeDeps: {
    // include: ["@enpage/sdk"],
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
      entry: "src/library.tsx",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react-icons",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "happy-dom",
        "happy-dom-without-node",
        "ajv",
        "@sinclair/typebox",
        "@enpage/style-system",
      ],
      output: {
        globals: {
          react: "react",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
        // Put chunk files at <output>/chunks
        chunkFileNames: "chunks/[name].[hash].js",
        // Put chunk styles at <output>/assets
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
