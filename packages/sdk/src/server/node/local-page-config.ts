import { join } from "node:path";
import type { AttributesMap, AttributesResolved } from "~/shared/attributes";
import type { DatasourceManifestMap, DatasourceResolved } from "~/shared/datasources";
import type { GenericPageConfig } from "~/shared/page-config";
import type { EnpageTemplateConfig } from "~/shared/template-config";

export async function getLocalPageConfig(configFile?: string): Promise<GenericPageConfig> {
  const configFilePath = configFile ?? join(process.cwd(), "enpage.config.js");
  const { attributes, datasources, manifest } = (await import(configFilePath)) as EnpageTemplateConfig;

  return {
    attributes,
    datasources,
    templateManifest: manifest,
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

function resolveAttributes(attributes: AttributesMap) {
  const attrs: AttributesResolved<AttributesMap> = {};
  for (const key in attributes) {
    const value = attributes[key].defaultValue;
    attrs[key] = value;
  }
  return attrs;
}
