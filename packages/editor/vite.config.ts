import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: "src/main.tsx",
        components: "src/components/index.tsx",
      },
      formats: ["es"],
    },
  },
});
