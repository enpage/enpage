import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";

process.env.ENPAGE_SITE_HOST ??= `localhost:3000`;
const [, port] = process.env.ENPAGE_SITE_HOST.split(":");

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ["PUBLIC_"],
  plugins: [Inspect(), react()],
  server: {
    port: 3008,
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        components: "src/components/index.tsx",
      },
      formats: ["es"],
    },
  },
});
