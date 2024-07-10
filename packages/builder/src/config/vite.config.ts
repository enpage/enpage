import { defineConfig, UserConfig, loadEnv } from "vite";
import { loadConfig, checkConfig } from "../config-utils";
import enpagePlugin from "../vite/enpage";
import { join, resolve } from "path";
import { existsSync } from "fs";
import { createLogger } from "../vite/logger";

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
    plugins: [enpagePlugin(config /*, ctx as PageContext<any, any>*/)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@enpage/liquid": resolve(__dirname, "../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
      },
    },
  };
});
