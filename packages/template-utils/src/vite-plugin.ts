import type { UserConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";
import { join, resolve, dirname } from "path";
import { readFileSync } from "fs";

const enpageVirtualModuleId = "virtual:enpage-template";
const enpageResolvedVirtualModuleId = "\0" + enpageVirtualModuleId;

// return partial config (recommended)
const viteEnpagePlugin = (): Plugin => {
  const packageJsonPath = join(process.cwd(), "package.json");
  const pkgdir = dirname(packageJsonPath);
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const templateFile = join(pkgdir, pkg.module);

  return {
    name: "enpage",
    config: (cfg, { command }): UserConfig => {
      console.log("templateFile", templateFile);
      return {
        plugins: [tsconfigPaths(), react()],
        resolve: {
          preserveSymlinks: true,
          dedupe: ["react", "react-dom"],
          alias: {
            [enpageVirtualModuleId]: templateFile,
          },
        },
        optimizeDeps: {
          include: ["@enpage/sdk", "@enpage/style-system"],
        },
        build: {
          sourcemap: true,
          lib: {
            entry: templateFile,
            // name: "EnpageTemplate",
            formats: ["es"],
            fileName: "template",
          },
          rollupOptions: {
            input: {
              "index.html": "index.html",
            },
            external: ["zod", "react", "react/jsx-runtime", "react-dom", "@enpage/sdk"],
            output: {
              esModule: true,
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                zod: "Zod",
                "@enpage/sdk": "Enpage",
                "@enpage/style-system": "StyleSystem",
              },
            },
          },
        },
      };
    },
  };
};

export default viteEnpagePlugin;
