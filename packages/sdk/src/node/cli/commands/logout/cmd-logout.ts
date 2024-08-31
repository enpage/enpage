import { logger } from "~/node/shared/logger";
import type { ArgOpts, CommonOptions } from "../../types";
import { accessStore } from "../../store";

export async function logout({ options }: ArgOpts<CommonOptions>) {
  logger.info(`Logging out fom Enpage...`);

  accessStore.clear();

  logger.info("Done.\n");
  process.exit(0);
}
