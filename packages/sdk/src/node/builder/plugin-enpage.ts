import { type ConfigEnv, loadEnv, type Plugin } from "vite";
import { join, dirname } from "node:path";
import { resolve as resolvePackage } from "import-meta-resolve";
import type { EnpageTemplateConfig } from "~/shared/template-config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplatePlugin } from "./plugin-renderer";
import { insertBasePlugin } from "./plugin-base-url";
import { contextPlugin } from "./plugin-context";
import { virtualFilesPlugin } from "./plugin-virtual-files";
import { manifestPlugin } from "./plugin-manifest";
import type { EnpageEnv } from "~/shared/env";
import inspectPlugin from "vite-plugin-inspect";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { existsSync } from "node:fs";
import { loadConfigFromJsFile } from "../shared/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// return partial config (recommended)
const enpagePlugin = (config: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  const styleSystemPath = dirname(fileURLToPath(resolvePackage("@enpage/style-system", import.meta.url)));

  return {
    name: "enpage",
    config: async (cfg, { command, mode }) => {
      const env = loadEnv(mode, process.cwd(), "");
      return {
        optimizeDeps: {
          exclude: ["@enpage/sdk"],
          include: ["@enpage/style-system"],
        },
        css: {
          postcss: resolve(__dirname, "./postcss.config.js"),
        },
        server: {
          host: true,
          cors: true,
          watch: {
            // Watch for changes in other packages
            ignored: ["!**/node_modules/**", "!../*/dist/**"],
            interval: 800,
          },
        },
        resolve: {
          alias: [
            {
              find: /@enpage\/style-system\/(.*)/,
              replacement: `${styleSystemPath}/$1`,
            },
          ],
        },
        build: {
          manifest: true,
          outDir: cfg.build?.ssrManifest ? "dist/client" : cfg.ssr ? "dist/server" : "dist",
          rollupOptions: {
            external: ["zod"],
            output: {
              esModule: true,
            },
            input: {
              main: resolve(process.cwd(), "index.html"),
            },
          },
        },
        experimental:
          command === "build" && env.PUBLIC_ENPAGE_ASSETS_BASE_URL
            ? {
                renderBuiltUrl(filename, { hostId, hostType, type }) {
                  if (type === "public") {
                    return `/${filename}`;
                  }
                  return `${env.PUBLIC_ENPAGE_ASSETS_BASE_URL}/${filename}`;
                },
              }
            : {},
      };
    },
  };
};

export default async function enpageMetaPlugin(viteEnv: ConfigEnv) {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");
  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const env = loadEnv(viteEnv.mode, process.cwd(), ["PUBLIC_"]) as unknown as EnpageEnv;

  const cachePath = join(process.cwd(), ".cache");
  const cfgPath = join(process.cwd(), "enpage.config.js");

  const config = await loadConfigFromJsFile(cfgPath);

  return [
    inspectPlugin(),
    virtualFilesPlugin(config, viteEnv, env),
    enpagePlugin(config, viteEnv, env),
    contextPlugin(config, viteEnv, env),
    renderTemplatePlugin(config, viteEnv, env),
    insertBasePlugin(config, viteEnv, env),
    manifestPlugin(config, viteEnv, env),
    // optimize images only in client build
    viteEnv.command === "build" &&
      !viteEnv.isSsrBuild &&
      ViteImageOptimizer({
        logStats: true,
        cache: true,
        cacheLocation: join(cachePath, "image-optimizer"),
      }),
    // stripBanner({}),
  ];
}
