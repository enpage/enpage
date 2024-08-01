import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";

process.env.ENPAGE_SITE_HOST ??= `localhost:3000`;
const [, port] = process.env.ENPAGE_SITE_HOST.split(":");

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ["PUBLIC_"],
  plugins: [Inspect(), react(), dts()],
  server: {
    port: 3008,
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        main: "src/components/index.tsx",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react-icons",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "zustand",
        "zundo",
        "clsx",
        "tailwind-merge",
        "@uidotdev/usehooks",
        "@headlessui/react",
        "@enpage/sdk",
        "immer",
      ],
      output: {
        globals: {
          react: "react",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
