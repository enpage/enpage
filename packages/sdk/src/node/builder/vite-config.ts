import { defineConfig, type UserConfig } from "vite";
import enpagePlugin from "./plugin-enpage";

export default defineConfig((viteConfigEnv) => {
  return {
    plugins: [enpagePlugin(viteConfigEnv)],
  };
});
