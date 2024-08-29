import { resolve } from "node:path";
import { getLocalPageConfig } from "~/server/node/local-page-config";
import { nanoid } from "nanoid";
import { templateManifestSchema } from "~/shared/manifest";
import { fromError } from "zod-validation-error";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import chalk from "chalk";
import { createLogger } from "~/node/shared/logger";
import type { ArgOpts, CommonOptions } from "../../types";
import { getPackageManager } from "../../utils";
import { isLoggedIn } from "../../config";
import { uploadFiles } from "./utils";

export async function publish({ options }: ArgOpts<CommonOptions>) {
  const logger = createLogger(options.logLevel, options.clearScreen);

  if (!isLoggedIn()) {
    const pkgCmd = getPackageManager();
    if (process.stdout.isTTY) {
      logger.error(
        `  ${chalk.redBright("Error")}: User token not found. Please run '${pkgCmd} run login' to authenticate.\n`,
      );
    } else {
      logger.error(
        `  ${chalk.redBright("Error")}: User token not found. Please set ENPAGE_API_TOKEN environment variable.\n`,
      );
    }
    process.exit(1);
  }

  // check if enpage.config.js and package.json exist in the current directory
  // if not, exit with an error
  const files = ["enpage.config.js", "package.json"];
  for (const file of files) {
    if (!existsSync(resolve(process.cwd(), file))) {
      logger.error(
        `  ${chalk.redBright("Error")}: file ${file} not found in the current directory. Aborting.\n`,
      );
      process.exit(1);
    }
  }

  // load manifest from both enpage.config.js and package.json
  // manifest.json is used to store the template ID for future updates
  const { templateManifest } = await getLocalPageConfig();

  // validate manifest
  const validation = templateManifestSchema.safeParse(templateManifest);
  if (!validation.success) {
    const err = fromError(validation.error);
    logger.error("Invalid template manifest. Please review your enpage.config.js file.");
    logger.error(`Error: ${err.toString()}\n\n`);
    process.exit(1);
  }

  // load package.json to get the template ID (if it exists)
  const pkg = JSON.parse(await fs.readFile(resolve(process.cwd(), "package.json"), "utf-8"));
  const templateId = pkg.enpage?.id ?? `tpl_${nanoid(10)}`;

  // submit template to Enpage
  logger.info(`Submitting template to Enpage...`);

  const uploadResults = await uploadFiles(templateId);

  if (uploadResults.hasUploadErrors) {
    logger.error("\n  Upload failed. Seet details above.\n");
    process.exit(1);
  }
}
