import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { PageContext } from "~/shared/page-config";
import { samples } from "~/shared/datasources/samples";
import type { AttributesMap, AttributesResolved } from "~/shared/attributes";
import invariant from "~/shared/utils/invariant";
import type { EnpageEnv } from "~/shared/env";
import type { ConfigEnv } from "vite";

export async function getPageContext<Config extends EnpageTemplateConfig>(
  cfg: Config,
  viteEnv: ConfigEnv,
  env: EnpageEnv,
) {
  const isBuildMode = viteEnv.command === "build";
  const isSsrBuild = viteEnv.isSsrBuild;
  const fullEnv: EnpageEnv = { ...process.env, ...env };

  // If in dev mode, use fake context
  if (!isBuildMode) {
    console.warn("Using fake context.");
    return createFakeContext(cfg);
    // If in build mode, fetch context from API if not SSR build
  } else if (!isSsrBuild) {
    return (await fetchContext(cfg, fullEnv)) || createFakeContext(cfg);
  }

  return null;
}

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

  const attr: AttributesResolved<AttributesMap> = {
    $siteDescription: "This is a site description",
    $siteKeywords: "site, keywords",
    $siteTitle: "Site title",
    $siteLanguage: "en",
    $siteLastUpdated: new Date().toISOString(),
  };

  for (const key in cfg.attributes.properties) {
    attr[key] = cfg.attributes.properties[key].default;
  }

  return { data, attr, bricks: cfg.bricks } as PageContext<
    typeof cfg.datasources,
    typeof cfg.attributes,
    typeof cfg.bricks
  >;
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

  const context = (await response.json()) as PageContext<
    typeof cfg.datasources,
    typeof cfg.attributes | AttributesMap,
    typeof cfg.bricks
  >;

  return context;
}
