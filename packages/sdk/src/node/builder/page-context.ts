import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { PageContext } from "~/shared/page-config";
import { samples } from "~/shared/datasources/samples";
import type { AttributesResolved } from "~/shared/attributes";
import invariant from "~/shared/utils/invariant";
import type { EnpageEnv } from "~/shared/env";

export function createFakeContext<Config extends EnpageTemplateConfig>(cfg: Config) {
  let data: Record<string, unknown> | undefined;

  if (cfg.datasources) {
    data = {} as Record<string, unknown>;
    for (const key in cfg.datasources) {
      const provider = cfg.datasources[key].provider;
      if (provider && provider !== "json") {
        data[key] = samples[provider];
      } else if ("sampleData" in cfg.datasources[key] && cfg.datasources[key].sampleData) {
        data[key] = cfg.datasources[key].sampleData;
      }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const attributes: AttributesResolved<any> = {};

  for (const key in cfg.attributes.properties) {
    attributes[key] = cfg.attributes.properties[key].default;
  }

  return { data, attr: attributes } as PageContext<typeof cfg.datasources, typeof cfg.attributes>;
}

/**
 * If no datasources or attributes are defined in the config, this function will return void.
 * If a env variable is missing, it will log an error and return false.
 * If all is OK, it will fetch the context from the Enpage API and return it.
 */

export async function fetchContext<Config extends EnpageTemplateConfig>(cfg: Config, env: EnpageEnv) {
  const apiToken = env.ENPAGE_API_TOKEN;
  const siteHost = env.PUBLIC_ENPAGE_SITE_HOST;
  const apiBaseUrl = env.PUBLIC_ENPAGE_API_BASE_URL;

  if (!apiToken) {
    console.warn("ENPAGE_API_TOKEN is empty. Skipping context fetch.");
    return false;
  }

  invariant(siteHost, "PUBLIC_ENPAGE_SITE_HOST is empty.");
  invariant(apiBaseUrl, "PUBLIC_ENPAGE_API_BASE_URL is empty.");

  const url = `${apiBaseUrl}/v1/sites/${siteHost}/context`;
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
