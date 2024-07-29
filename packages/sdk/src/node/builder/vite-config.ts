import { defineConfig, type UserConfig, loadEnv } from "vite";
import { loadConfig, checkConfig } from "./config";
import enpagePlugin from "./plugin-enpage";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { createLogger } from "./logger";

export default defineConfig(async (viteConfigEnv): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }
  const cfgPath = join(process.cwd(), "enpage.config.js");
  const config = await loadConfig(cfgPath);

  return {
    // Keep VITE_ prefix for portability with Vite and for plugins using Vite's env
    envPrefix: ["VITE_", "ENPAGE_"],
    plugins: [enpagePlugin(config, viteConfigEnv)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@enpage/liquid": resolve(__dirname, "../../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
      },
    },
  };
});
