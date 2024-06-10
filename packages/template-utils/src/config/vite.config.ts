import { defineConfig, UserConfig } from "vite";
import { addTemplateDeps } from "../vite/add-template-deps";
import { loadEnpageConfig } from "../vite/load-config";
import { generateContext } from "../vite/generate-context";
import { minifyHtml } from "../vite/minify-html";
import viteEnpagePlugin from "../vite/enpage";
import { join } from "path";

export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }): Promise<UserConfig> => {
  const cfgPath = join(process.cwd(), "enpage.config.js");
  const enpageCfg = await loadEnpageConfig(cfgPath);
  return {
    clearScreen: false,
    plugins: [
      viteEnpagePlugin(),
      addTemplateDeps(),
      ...(mode === "development" ? [generateContext(enpageCfg)] : []),
      ...(mode === "production" ? [minifyHtml()] : []),
    ],
    server: {
      host: true,
    },
  };
});
