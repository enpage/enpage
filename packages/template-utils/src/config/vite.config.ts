import { defineConfig, UserConfig, loadEnv } from "vite";
import { addTemplateDeps } from "../vite/add-template-deps";
import { loadEnpageConfig } from "../vite/load-config";
import { generateContext } from "../vite/generate-context";
import { minifyHtml } from "../vite/minify-html";
import viteEnpagePlugin from "../vite/enpage";
import { join } from "path";

export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }): Promise<UserConfig> => {
  const cfgPath = join(process.cwd(), "enpage.config.js");
  const enpageCfg = await loadEnpageConfig(cfgPath);
  const env = loadEnv(mode, process.cwd(), "");

  return {
    clearScreen: false,
    plugins: [
      viteEnpagePlugin(),
      addTemplateDeps(),
      ...(command === "serve" ? [generateContext(enpageCfg)] : []),
      ...(command === "build" ? [minifyHtml()] : []),
    ],
    server: {
      host: true,
    },
    build: {
      manifest: true,
      outDir: ".template-dist",
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
});
