import { defineConfig } from "vite";
import enpagePlugin from "./plugin-enpage";

export default defineConfig((viteConfigEnv) => {
  return {
    root: process.cwd(),
    plugins: [enpagePlugin(viteConfigEnv)],
  };
});
