import { defineConfig } from "vite";
import enpagePlugin from "@enpage/template-utils/vite-plugin";

export default defineConfig({
  plugins: [enpagePlugin()],
});
