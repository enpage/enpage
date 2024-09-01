import { defineConfig, type UserConfig, loadEnv } from "vite";
import { loadConfig } from "./config";
import enpagePlugin from "./plugin-enpage";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import inspectPlugin from "vite-plugin-inspect";
import type { EnpageEnv } from "~/shared/env";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { resolve as resolvePackage } from "import-meta-resolve";
import { fileURLToPath } from "node:url";

export default defineConfig(async (viteConfigEnv): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");
  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const env = loadEnv(viteConfigEnv.mode, process.cwd(), ["PUBLIC_"]);

  const cachePath = join(process.cwd(), ".cache");

  const cfgPath = join(process.cwd(), "enpage.config.js");
  const config = await loadConfig(cfgPath);

  const isBuild = viteConfigEnv.command === "build";
  const isSsrBuild = isBuild && viteConfigEnv.isSsrBuild === true;

  const styleSystemPath = dirname(fileURLToPath(resolvePackage("@enpage/style-system", import.meta.url)));

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
          cacheLocation: join(cachePath, "image-optimizer"),
        }),
    ],
    optimizeDeps: {
      include: ["@enpage/style-system"],
    },
    resolve: {
      alias: [
        {
          find: /@enpage\/style-system\/(.*)/,
          replacement: `${styleSystemPath}/$1`,
        },
      ],
    },
  };
});
