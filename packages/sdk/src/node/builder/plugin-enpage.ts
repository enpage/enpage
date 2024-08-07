import { type ConfigEnv, loadEnv, type Plugin } from "vite";
import stripBanner from "rollup-plugin-strip-banner";
import type { EnpageTemplateConfig } from "~/shared/template-config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplatePlugin } from "./plugin-renderer";
import { insertBasePlugin } from "./plugin-base-url";
import { contextPlugin } from "./plugin-context";
import { virtualFilesPlugin } from "./plugin-virtual-files";
import { manifestPlugin } from "./plugin-manifest";
import type { EnpageEnv } from "~/shared/env";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// return partial config (recommended)
const enpagePlugin = (config: EnpageTemplateConfig, viteEnv: ConfigEnv, env: EnpageEnv): Plugin => {
  return {
    name: "enpage",
    config: async (cfg, { command, mode }) => {
      const env = loadEnv(mode, process.cwd(), "");
      return {
        optimizeDeps: {
          exclude: ["@enpage/sdk"],
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
        build: {
          manifest: true,
          // ssrManifest: true,
          outDir: cfg.build?.ssrManifest
            ? ".enpage/dist/client"
            : cfg.ssr
              ? ".enpage/dist/server"
              : ".enpage/dist",
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
          command === "build" && !env.NO_CDN && viteEnv.mode !== "development"
            ? {
                renderBuiltUrl(filename, { hostId, hostType, type }) {
                  if (type === "public") {
                    return `/${filename}`;
                  }
                  return `https://cdn.enpage.co/sites/${env.SITE_SLUG}/${filename}`;
                },
              }
            : {},
      };
    },
  };
};

export default async function enpageMetaPlugin(
  config: EnpageTemplateConfig,
  viteEnv: ConfigEnv,
  env: EnpageEnv,
) {
  return [
    virtualFilesPlugin(config, viteEnv, env),
    enpagePlugin(config, viteEnv, env),
    contextPlugin(config, viteEnv, env),
    renderTemplatePlugin(config, viteEnv, env),
    insertBasePlugin(config, viteEnv, env),
    manifestPlugin(config, viteEnv, env),
    // stripBanner({}),
  ];
}
