import { type Plugin } from "vite";
import { logger } from "./logger";
import { resolve } from "path";

// return partial config (recommended)
const viteEnpagePlugin = (): Plugin => {
  return {
    name: "enpage",
    config: async (cfg, { command, mode }) => {
      return {
        customLogger: logger,
        esbuild: { legalComments: "none" },

        optimizeDeps: {
          exclude: ["@enpage/sdk"],
        },
        server: {
          host: true,
          open: true,
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
      };
    },
  };
};

export default viteEnpagePlugin;
