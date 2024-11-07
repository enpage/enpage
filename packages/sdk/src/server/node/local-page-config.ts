import { join } from "node:path";
import { resolveAttributes, type AttributesMap, type AttributesResolved } from "~/shared/attributes";
import type { DatasourceManifestMap, DatasourceResolved } from "~/shared/datasources";
import type { GenericPageConfig } from "~/shared/page";
import type { EnpageTemplateConfig } from "~/shared/template-config";

export async function getLocalPageConfig(configFile?: string): Promise<GenericPageConfig> {
  const configFilePath = configFile ?? join(process.cwd(), "enpage.config.js");
  const { attributes, datasources, manifest, containers } = (await import(
    configFilePath
  )) as EnpageTemplateConfig;

  return {
    attributes,
    datasources,
    bricks: containers,
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
