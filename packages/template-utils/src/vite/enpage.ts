import { type Plugin } from "vite";
import { join } from "path";
import { logger } from "./logger";

// return partial config (recommended)
const viteEnpagePlugin = (): Plugin => {
  return {
    name: "enpage",
    config: async (cfg, { command, mode }) => {
      return {
        customLogger: logger,
        esbuild: { legalComments: "none" },
        resolve: {
          preserveSymlinks: true,
        },
        optimizeDeps: {
          include: ["@enpage/sdk", "@enpage/sdk/components"],
        },
        build: {
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
