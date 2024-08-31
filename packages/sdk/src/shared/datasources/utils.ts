import type { EnpageEnv } from "../env";
import type { ProviderOptions } from "./types";

export function getNextRefreshDelay(options: ProviderOptions, env: EnpageEnv) {
  return +(options.nextRefreshDelay ?? env.DATASOURCE_REFRESH_DELAY_IN_MINUTE);
}

export function stringifyObjectValues(
  obj: Record<string, string | number | Date | boolean>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value.toString()]));
}
