import { loadEnv, type Plugin } from "vite";
import type { EnpageTemplateConfig } from "@enpage/types/config";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { render } from "./render";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// return partial config (recommended)
const enpagePlugin = (): Plugin => {
  return {
    name: "enpage",
    config: async (cfg, { command, mode, isSsrBuild }) => {
      const env = loadEnv(mode, process.cwd(), "");
      return {
        esbuild: { legalComments: "none" },
        optimizeDeps: {
          exclude: ["@enpage/sdk"],
        },
        css: {
          postcss: resolve(__dirname, "../dist/config/postcss.config.js"),
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

export default async function enpageMetaPlugin(config: EnpageTemplateConfig) {
  return [enpagePlugin(), render(config)];
}
