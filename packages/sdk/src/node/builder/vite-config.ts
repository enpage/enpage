import { defineConfig, type UserConfig, loadEnv } from "vite";
import { loadConfig, checkConfig } from "./config";
import enpagePlugin from "./plugin-enpage";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";
import inspectPlugin from "vite-plugin-inspect";
import type { EnpageEnv } from "~/shared/env";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// const require = createRequire(import.meta.url);

export default defineConfig(async (viteConfigEnv): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const cachePath = join(process.cwd(), ".cache", "image-optimizer");
  const cfgPath = join(process.cwd(), "enpage.config.js");
  const config = await loadConfig(cfgPath);
  const env = loadEnv(viteConfigEnv.mode, process.cwd(), ["PUBLIC_"]);
  const isBuild = viteConfigEnv.command === "build";
  const isSsrBuild = isBuild && viteConfigEnv.isSsrBuild === true;

  return {
    envPrefix: ["PUBLIC_"],
    envDir: process.cwd(),
    plugins: [
      inspectPlugin(),
      enpagePlugin(config, viteConfigEnv, env as unknown as EnpageEnv),
      // optimize images only in client build
      isBuild &&
        !isSsrBuild &&
        ViteImageOptimizer({
          logStats: true,
          cache: true,
          cacheLocation: cachePath,
        }),
    ],
    resolve: {
      alias: [
        {
          find: /@enpage\/style-system\/(.*)/,
          replacement: `${resolve(__dirname, "../../../node_modules/@enpage/style-system/src")}/$1`,
        },
      ],
    },
  };
});
