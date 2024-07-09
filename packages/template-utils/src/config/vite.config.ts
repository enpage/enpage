import { defineConfig, UserConfig, loadEnv } from "vite";
import { loadEnpageConfig } from "../load-config";
import enpagePlugin from "../vite/enpage";
import { join } from "path";
import { existsSync } from "fs";
import { createFakeContext, fetchContext } from "@enpage/sdk/context";
import { PageContext } from "@enpage/types/context";

export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }): Promise<UserConfig> => {
  const tailwindCfgPath = join(process.cwd(), "tailwind.config.js");

  if (!existsSync(tailwindCfgPath)) {
    process.env.DISABLE_TAILWIND = "true";
  }

  const cfgPath = join(process.cwd(), "enpage.config.js");
  const { config, logger } = await loadEnpageConfig(cfgPath);

  let ctx = command == "build" ? await fetchContext(config) : createFakeContext(config);
  if (ctx === false) {
    logger.error("Failed to fetch context. Using fake context instead.");
    ctx = createFakeContext(config);
  }

  return {
    plugins: [enpagePlugin(config, ctx as PageContext<any, any>, logger)],
  };
});
