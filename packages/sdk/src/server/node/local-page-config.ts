import type { RequestContext } from "@hattip/compose";
import { join } from "node:path";
import type { AttributesMap, AttributesResolved } from "~/shared/attributes";
import type { DatasourceManifestMap } from "~/shared/datasources";
import type { TemplateManifest } from "~/shared/manifest";
import type { GenericPageConfig } from "~/shared/page-config";

export async function getPageConfigFromLocalFiles(ctx: RequestContext): Promise<GenericPageConfig> {
  const { attributes, datasources, manifest } = (await import(join(process.cwd(), "enpage.config.js"))) as {
    attributes: AttributesMap;
    datasources: DatasourceManifestMap;
    manifest: TemplateManifest;
  };

  return {
    attributes,
    datasources,
    templateManifest: manifest,
    siteConfig: {},
    attrs: resolveAttributes(attributes),
  };
}

function resolveAttributes(attributes: AttributesMap) {
  const attrs: AttributesResolved<AttributesMap> = {};
  for (const key in attributes) {
    const value = attributes[key].defaultValue;
    attrs[key] = value;
  }
  return attrs;
}
