import { defineConfig, type UserConfig, loadEnv } from "vite";
import { loadConfig, checkConfig } from "./config";
import enpagePlugin from "./plugin-enpage";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";
// import { createLogger } from "./logger";
import { createRequire } from "node:module";
import inspectPlugin from "vite-plugin-inspect";

// const require = createRequire(import.meta.url);

export default defineConfig(async (viteConfigEnv): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }
  const cfgPath = join(process.cwd(), "enpage.config.js");
  const config = await loadConfig(cfgPath);

  return {
    envPrefix: ["PUBLIC_"],
    plugins: [inspectPlugin(), enpagePlugin(config, viteConfigEnv)],
    resolve: {
      preserveSymlinks: true,
      alias: [
        {
          find: "@enpage/liquid",
          replacement: resolve(__dirname, "../../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
        },
        {
          find: /@enpage\/style-system\/(.*)/,
          replacement: `${resolve(__dirname, "../../../node_modules/@enpage/style-system/src")}/$1`,
        },
      ],
    },
  };
});
