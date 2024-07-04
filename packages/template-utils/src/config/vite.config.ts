import { defineConfig, UserConfig, loadEnv } from "vite";
import { addTemplateDeps } from "../vite/add-template-deps";
import { loadEnpageConfig } from "../vite/load-config";
import { renderTemplate } from "../vite/render";
import { minifyHtml } from "../vite/minify-html";
import viteEnpagePlugin from "../vite/enpage";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import { logger } from "../vite/logger";
import { PageContext } from "@enpage/types/context";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const cfgPath = join(process.cwd(), "enpage.config.js");
  const enpageCfg = await loadEnpageConfig(cfgPath);

  const env = loadEnv(mode, process.cwd(), "");

  let ctx = command == "build" ? await fetchContext(enpageCfg) : createFakeContext(enpageCfg);
  if (ctx === false) {
    logger.error("Failed to fetch context. Using fake context instead.");
    ctx = createFakeContext(enpageCfg);
  }

  return {
    clearScreen: false,
    css: {
      postcss: resolve(__dirname, "./postcss.config.js"),
    },
    plugins: [
      viteEnpagePlugin(),
      addTemplateDeps(enpageCfg, ctx as PageContext<any, any>),
      renderTemplate(enpageCfg, ctx as PageContext<any, any>),
      ...(command === "build" ? [minifyHtml()] : []),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@enpage/liquid": resolve(__dirname, "../../node_modules/liquidjs/dist/liquid.browser.esm.js"),
      },
    },
    server: {
      watch: {
        // Watch for changes in other packages
        ignored: ["!**/node_modules/**", "!../*/dist/**"],
        interval: 800,
      },
    },
    // server: {
    //   host: true,
    //   open: true,
    // },
    // build: {
    //   manifest: true,
    //   outDir: ".template-dist",
    // },
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
