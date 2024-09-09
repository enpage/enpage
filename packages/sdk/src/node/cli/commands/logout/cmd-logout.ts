import type { CommandArgOpts, CommonOptions } from "../../types";
import { accessStore } from "../../store";

export async function logout({ options, logger }: CommandArgOpts<CommonOptions>) {
  logger.info(`Logging out fom Enpage...`);

  accessStore.clear();

  logger.info("Done.\n");
  process.exit(0);
}
