import type {
  DatasourceGenericResolved,
  DatasourceHttpJsonProviderManifest,
  DatasourceManifestMap,
  DatasourceResolved,
  TSchema,
} from "~/shared/datasources";
import { MAX_LIVE_DATASOURCES } from "./constants";
import type { GenericPageConfig } from "~/shared/page-config";
import get from "lodash-es/get";

export async function fetchDatasources(pageConfig: GenericPageConfig) {
  const datasources = pageConfig.datasources as DatasourceManifestMap;
  let eligibleDatasources = Object.entries(datasources).filter(
    ([, datasource]) => datasource.provider === "http-json",
  ) as [string, DatasourceHttpJsonProviderManifest<TSchema>][];

  const count = eligibleDatasources.length;
  eligibleDatasources = eligibleDatasources.slice(0, MAX_LIVE_DATASOURCES);

  const fetchResults = await Promise.allSettled(
    eligibleDatasources.map(async ([key, datasource]) => {
      try {
        const result = await fetchJsonDataSource(datasource, pageConfig);
        return { key, result };
      } catch (error) {
        console.log({ datasource, pageConfig });
        throw new Error(`Error fetching datasource "${key}": ${(error as Error).message}`);
      }
    }),
  );

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const data: DatasourceResolved<any> = {};
  fetchResults.forEach((result) => {
    if (result.status === "fulfilled") {
      data[result.value.key] = result.value.result as DatasourceGenericResolved<TSchema>;
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

async function fetchJsonDataSource(
  datasource: DatasourceHttpJsonProviderManifest<TSchema>,
  pageConfig: GenericPageConfig,
): Promise<unknown> {
  let {
    options: { url, headers },
  } = datasource;

  const placeholderRx = /{{(.+?)}}/g;
  const replacer = replacePlaceholderReplacer(pageConfig);
  url = url.replace(placeholderRx, replacer);

  if (headers) {
    for (const [key, value] of Object.entries(headers ?? {})) {
      headers[key] = (value as string).replace(placeholderRx, replacer);
    }
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error fetching data source! status: ${res.status}`);
  }
  return res.json();
}

function replacePlaceholderReplacer(pageConfig: GenericPageConfig) {
  return function replacePlaceholders(_: unknown, p1: string) {
    const varName = (p1 as string).trim();
    return get(pageConfig, varName) ?? "";
  };
}
