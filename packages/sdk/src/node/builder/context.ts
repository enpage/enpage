import type { EnpageTemplateConfig } from "~/shared/config";
import type { PageContext } from "~/shared/context";
import { providersSamples } from "~/shared/data-samples";
import type { AttributesResolved } from "~/shared/attributes";
import type { Logger } from "vite";

export function createFakeContext<Config extends EnpageTemplateConfig>(cfg: Config, logger: Logger) {
  let data: Record<string, unknown> | undefined;

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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const attributes: AttributesResolved<any> = {};
  for (const key in cfg.attributes) {
    attributes[key] = cfg.attributes[key].defaultValue;
  }

  return { data, attributes } as PageContext<typeof cfg.datasources, typeof cfg.attributes>;
}

/**
 * If no datasources or attributes are defined in the config, this function will return void.
 * If a env variable is missing, it will log an error and return false.
 * If all is OK, it will fetch the context from the Enpage API and return it.
 */

export async function fetchContext<Config extends EnpageTemplateConfig>(
  cfg: Config,
  logger: Logger,
  env = process.env,
) {
  const apiToken = env.PRIVATE_ENPAGE_API_TOKEN;
  const siteHost = env.ENPAGE_SITE_HOST;
  const apiBaseUrl = env.ENPAGE_API_BASE_URL;
  // Abort if there is no datasources or attributes
  if (
    (!cfg.datasources || !Object.keys(cfg.datasources).length) &&
    (!cfg.attributes || !Object.keys(cfg.attributes).length)
  ) {
    console.error("No datasources or attributes found in config. Skipping context fetch.");
    return;
  }
  // Abort if there is no siteHost
  if (!siteHost) {
    logger.error("ENPAGE_SITE_HOST is empty. Skipping context fetch.");
    return false;
  }
  // Abort if there is no apiToken
  if (!apiToken) {
    console.error("PRIVATE_ENPAGE_API_TOKEN is empty. Skipping context fetch.");
    return false;
  }
  // Abort if there is no apiHost
  if (!apiBaseUrl) {
    console.error("ENPAGE_API_BASE_URL is empty. Skipping context fetch.");
    return false;
  }

  const url = `${apiBaseUrl}/sites/${siteHost}/context`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const context = (await response.json()) as PageContext<typeof cfg.datasources, typeof cfg.attributes | any>;

  return context;
}
