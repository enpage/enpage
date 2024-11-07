import { join } from "node:path";
import { resolveAttributes } from "~/shared/attributes";
import type { DatasourceManifestMap, DatasourceResolved } from "~/shared/datasources";
import type { GenericPageConfig } from "~/shared/page";
import type { EnpageTemplateConfig } from "~/shared/template-config";

export async function getLocalPageConfig(configFile?: string, path = "/"): Promise<GenericPageConfig> {
  const configFilePath = configFile ?? join(process.cwd(), "enpage.config.js");
  const { attributes, datasources, manifest, pages } = (await import(configFilePath)) as EnpageTemplateConfig;

  return {
    id: "temp-page",
    siteId: "temp-site",
    path,
    attributes,
    datasources,
    bricks: pages.find((p) => p.path === path)?.bricks ?? [],
    manifest: manifest,
    attr: resolveAttributes(attributes),
    data: resolveData(datasources ?? {}),
  };
}

function resolveData<M extends DatasourceManifestMap>(datasources: M) {
  const data: DatasourceResolved<M> = {} as DatasourceResolved<M>;
  for (const key in datasources) {
    // @ts-ignore
    data[key] = datasources[key].sampleData;
  }
  return data;
}
