import { loadEnv, type Plugin, type Logger } from "vite";
import { createLogger } from "./logger";
import type { EnpageTemplateConfig } from "@enpage/types/config";
import type { PageContext } from "@enpage/types/context";
import { join, resolve } from "path";
import { existsSync } from "fs";
import { loadEnpageConfig } from "../load-config";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import { fileURLToPath } from "url";
import { render } from "./render";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// return partial config (recommended)
const enpagePlugin = (config: EnpageTemplateConfig, logger: Logger): Plugin => {
  return {
    name: "enpage",
    config: async (cfg, { command, mode, isSsrBuild }) => {
      const env = loadEnv(mode, process.cwd(), "");
      return {
        customLogger: logger,
        esbuild: { legalComments: "none" },
        optimizeDeps: {
          exclude: ["@enpage/sdk"],
        },
        css: {
          postcss: resolve(__dirname, "../../src/config/postcss.config.cjs"),
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
        resolve: {
          preserveSymlinks: true,
          alias: {
            "@enpage/liquid": resolve(__dirname, "../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
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
          },
        },
        experimental:
          command === "build"
            ? {
                renderBuiltUrl(filename, { hostId, hostType, type }) {
                  if (type === "public") {
                    return `/${filename}`;
                  } else {
                    return `https://cdn.enpage.co/sites/${env.SITE_SLUG}/${filename}`;
                  }
                },
              }
            : {},
      };
    },
  };
};

export default async function enpageMetaPlugin(
  config: EnpageTemplateConfig,
  ctx: PageContext<any, any>,
  logger: Logger,
) {
  return [enpagePlugin(config, logger), render(config, ctx, logger)];
}
