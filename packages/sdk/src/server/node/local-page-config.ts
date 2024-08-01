import type { RequestContext } from "@hattip/compose";
import { join } from "node:path";
import type { AttributesMap, AttributesResolved } from "~/shared/attributes";
import type { DatasourceManifestMap, DatasourceResolved } from "~/shared/datasources";
import type { TemplateManifest } from "~/shared/manifest";
import type { GenericPageConfig } from "~/shared/page-config";

export async function getPageConfigFromLocalFiles(ctx: RequestContext): Promise<GenericPageConfig> {
  const { attributes, datasources, manifest } = (await import(join(process.cwd(), "enpage.config.js"))) as {
    attributes: AttributesMap;
    datasources: DatasourceManifestMap | undefined;
    manifest: TemplateManifest;
  };

  return {
    attributes,
    datasources,
    templateManifest: manifest,
    siteConfig: {},
    attr: resolveAttributes(attributes),
    data: resolveData(datasources ?? {}),
  };
}

function resolveData(datasources: DatasourceManifestMap) {
  const data: DatasourceResolved<DatasourceManifestMap> = {};
  for (const key in datasources) {
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
