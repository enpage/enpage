import type { EnpageTemplateConfig } from "~/shared/template-config";
import type { GenericPageContext, PageContext } from "~/shared/page";
import { samples } from "~/shared/datasources/samples";
import { resolveAttributes } from "~/shared/attributes";
import invariant from "~/shared/utils/invariant";
import type { EnpageEnv } from "~/shared/env";
import type { ConfigEnv } from "vite";
import type { DatasourceManifestMap, DatasourceResolved } from "~/shared/datasources";

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

export function createFakeContext<Config extends EnpageTemplateConfig>(
  cfg: Config,
  path = "/",
): GenericPageContext {
  return {
    ...cfg,
    data: cfg.datasources ? resolveDatasource(cfg.datasources) : undefined,
    attr: resolveAttributes(cfg.attributes),
    bricks: cfg.pages.find((p) => p.path === path)?.bricks ?? [],
  };
}

function resolveDatasource<D extends DatasourceManifestMap>(datasources: D) {
  const data = {} as DatasourceResolved<DatasourceManifestMap>;
  for (const key in datasources) {
    const provider = datasources[key].provider;
    if (provider && provider !== "json") {
      data[key] = samples[provider];
    } else if ("sampleData" in datasources[key] && datasources[key].sampleData) {
      data[key] = datasources[key].sampleData;
    }
  }
  return data;
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

  const context = (await response.json()) as GenericPageContext;

  return context;
}
