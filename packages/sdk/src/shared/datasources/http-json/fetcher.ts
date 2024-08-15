import type { HttpJsonOptions } from "./types";
import type { DatasourceFetcher } from "../types";
import type { GenericPageConfig } from "~/shared/page-config";
import get from "lodash-es/get";

/**
 * For this fetcher, validation is done outside of the fetcher.
 */
const fetchHttpJSON: DatasourceFetcher<unknown, null, HttpJsonOptions> = async ({ options }) => {
  const placeholderRx = /{{(.+?)}}/g;
  const replacer = createPlaceholderReplacer(options.pageConfig);
  const url = options.url.replace(placeholderRx, replacer);
  const headers: Record<string, string> = {};

  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers ?? {})) {
      headers[key] = (value as string).replace(placeholderRx, replacer);
    }
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`fetchHttpJSON Error: Response status: ${response.status}`);
  }

  return response.json();
};

export default fetchHttpJSON;

function createPlaceholderReplacer(pageConfig: GenericPageConfig) {
  return function replacePlaceholders(_: unknown, p1: string) {
    const varName = (p1 as string).trim();
    return get(pageConfig, varName) ?? "";
  };
}