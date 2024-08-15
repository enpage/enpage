import type { EnpageEnv } from "../env";
import type { Options } from "./types";

export function getNextRefreshDelay(options: Options, env: EnpageEnv) {
  return +(options.nextRefreshDelay ?? env.DATASOURCE_REFRESH_DELAY_IN_MINUTE);
}
