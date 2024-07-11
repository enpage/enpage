import type { EnpageTemplateConfig } from "@enpage/types/config";
import type { PageContext } from "@enpage/types/context";
import { providersSamples } from "../../sample";
import type { AttributesResolved } from "@enpage/types/attributes";

export function createFakeContext(cfg: EnpageTemplateConfig) {
  let data;

  if (cfg.datasources) {
    data = {} as Record<string, unknown>;
    for (const key in cfg.datasources) {
      const provider = cfg.datasources[key].provider;
      if (typeof provider === "string") {
        data[key] = providersSamples[provider];
      } else if ("sampleData" in cfg.datasources[key] && cfg.datasources[key].sampleData) {
        data[key] = cfg.datasources[key].sampleData;
      }
    }
  }

  let attributes: AttributesResolved<any> = {};
  for (const key in cfg.attributes) {
    attributes[key] = cfg.attributes[key].defaultValue;
  }

  return { data, attributes } as PageContext<typeof cfg.datasources, typeof cfg.attributes | any>;
}

/**
 * If no datasources or attributes are defined in the config, this function will return void.
 * If a env variable is missing, it will log an error and return false.
 * If all is OK, it will fetch the context from the Enpage API and return it.
 */

export async function fetchContext(cfg: EnpageTemplateConfig, env = process.env) {
  const siteId = env.ENPAGE_SITE_ID;
  const apiToken = env.API_TOKEN;
  let apiBaseUrl = env.ENPAGE_API_BASE_URL;
  // Abort if there is no datasources or attributes
  if (
    (!cfg.datasources || !Object.keys(cfg.datasources).length) &&
    (!cfg.attributes || !Object.keys(cfg.attributes).length)
  ) {
    console.error("No datasources or attributes found in config. Skipping context fetch.");
    return;
  }
  // Abort if there is no siteId
  if (!siteId) {
    console.error("ENPAGE_SITE_ID is empty. Skipping context fetch.");
    return false;
  }
  // Abort if there is no apiToken
  if (!apiToken) {
    console.error("ENPAGE_API_TOKEN is empty. Skipping context fetch.");
    return false;
  }
  // Abort if there is no apiHost
  if (!apiBaseUrl) {
    console.error("ENPAGE_API_BASE_URL is empty. Skipping context fetch.");
    return false;
  }

  const url = `${apiBaseUrl}/sites/${siteId}/context`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });

  const context = (await response.json()) as PageContext<typeof cfg.datasources, typeof cfg.attributes | any>;

  return context;
}
