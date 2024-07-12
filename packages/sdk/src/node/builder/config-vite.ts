import { defineConfig, UserConfig, loadEnv } from "vite";
import { loadConfig, checkConfig } from "./config";
import enpagePlugin from "./enpage-plugin";
import { join, resolve } from "path";
import { existsSync } from "fs";
import { createLogger } from "./logger";

export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const cfgPath = join(process.cwd(), "enpage.config.js");
  const config = await loadConfig(cfgPath);
  const logger = createLogger(config.settings);

  checkConfig(config, logger);

  return {
    customLogger: logger,
    envPrefix: ["VITE_", "ENPAGE_"],
    plugins: [enpagePlugin(config)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@enpage/liquid": resolve(__dirname, "../../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
      },
    },
  };
});
