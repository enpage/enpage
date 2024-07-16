import { build, type ConfigEnv, loadEnv, type Plugin } from "vite";
import type { EnpageTemplateConfig } from "~/shared/config";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { renderTemplate } from "./render-template";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// return partial config (recommended)
const enpagePlugin = (): Plugin => {
  console.log("enpage cdw %s", process.cwd());

  return {
    name: "enpage",
    config: async (cfg, { command, mode, isSsrBuild }) => {
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
          open: true,
          watch: {
            // Watch for changes in other packages
            ignored: ["!**/node_modules/**", "!../*/dist/**"],
            interval: 800,
          },
        },
        build: {
          manifest: true,
          outDir: ".template-dist",
          rollupOptions: {
            external: ["zod"],
            output: {
              esModule: true,
            },
            input: {
              main: resolve(process.cwd(), "index.html"),
              editor: relative(process.cwd(), "./node_modules/@enpage/sdk/dist/node/builder/editor.html"),
            },
          },
        },
        experimental:
          command === "build"
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

export default async function enpageMetaPlugin(config: EnpageTemplateConfig, viteConfigEnv: ConfigEnv) {
  console.log("viteConfigEnv", viteConfigEnv);
  return [enpagePlugin(), renderTemplate(config)];
}
