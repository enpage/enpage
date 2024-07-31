import type { GenericPageContext } from "~/shared/page-context";
import type {
  DatasourceGenericResolved,
  DatasourceHttpJsonProviderManifest,
  DatasourceManifestMap,
  DatasourceResolved,
} from "~/shared/datasources";
import { MAX_LIVE_DATASOURCES } from "./constants";

export async function fetchDatasources(datasources: DatasourceManifestMap) {
  let eligibleDatasources = Object.entries(datasources).filter(
    ([, datasource]) => datasource.provider === "http-json",
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ) as [string, DatasourceHttpJsonProviderManifest<any>][];

  const count = eligibleDatasources.length;
  eligibleDatasources = eligibleDatasources.slice(0, MAX_LIVE_DATASOURCES);

  const fetchResults = await Promise.allSettled(
    eligibleDatasources.map(async ([key, datasource]) => {
      try {
        const result = await fetchJson(datasource.url);
        return { key, result };
      } catch (error) {
        throw new Error(`Error fetching datasource ${key}: ${(error as Error).message}`);
      }
    }),
  );

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const data: DatasourceResolved<any> = {};
  fetchResults.forEach((result) => {
    if (result.status === "fulfilled") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      data[result.value.key] = result.value.result as DatasourceGenericResolved<any>;
    } else {
      console.log(result.reason.message);
    }
  });

  if (count >= MAX_LIVE_DATASOURCES) {
    console.warn(
      `Exceeded maximum number of live datasources: Got ${count}, allowed is ${MAX_LIVE_DATASOURCES}.`,
    );
  }

  return data;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error fetching data source! status: ${res.status}`);
  }
  return res.json();
}
