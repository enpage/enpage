import type { TSchema, DatasourceProviderManifest } from "~/shared/datasources";
import { MAX_LIVE_DATASOURCES } from "./constants";
import type { GenericPageConfig } from "~/shared/page-config";
import fetchHttpJSON from "~/shared/datasources/http/json/fetcher";
import type { EnpageEnv } from "~/shared/env";
import type { HttpJsonOptions } from "~/shared/datasources/http/json/options";

type DatasourceLiveOnlyManifest = DatasourceProviderManifest<"http-json", HttpJsonOptions, TSchema>;
type DatasourceLiveOnlyManifestEntry = [string, DatasourceLiveOnlyManifest];

export async function fetchDatasources(env: EnpageEnv, pageConfig: GenericPageConfig) {
  const datasources = pageConfig.datasources;
  if (!datasources) {
    return null;
  }

  let eligibleDatasources = Object.entries(datasources).filter(
    ([, datasource]) => datasource.provider === "http-json",
  ) as DatasourceLiveOnlyManifestEntry[];

  const count = eligibleDatasources.length;
  eligibleDatasources = eligibleDatasources.slice(0, MAX_LIVE_DATASOURCES);

  const fetchResults = await Promise.allSettled(
    eligibleDatasources.map(async ([key, datasource]) => {
      try {
        const result = await fetchHttpJSON({
          options: {
            url: datasource.options.url,
            headers: datasource.options.headers,
          },
          pageConfig,
          oauth: null,
        });
        return { key, result };
      } catch (error) {
        console.log({ datasource, pageConfig });
        throw new Error(`Error fetching datasource "${key}": ${(error as Error).message}`);
      }
    }),
  );

  const data: Record<string, unknown> = {};
  fetchResults.forEach((result) => {
    if (result.status === "fulfilled") {
      data[result.value.key] = result.value.result;
    } else {
      console.error(`Error fetching datasource: ${result.reason.message}`);
    }
  });

  if (count >= MAX_LIVE_DATASOURCES) {
    console.warn(
      `Exceeded maximum number of live datasources: Got ${count}, allowed is ${MAX_LIVE_DATASOURCES}.`,
    );
  }

  return data;
}
