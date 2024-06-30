import type { DatasourceManifestMap } from "./datasources";
import type { AttributesMap } from "./attributes";
import type { TemplateSettings } from "./settings";
import type { TemplateManifest } from "./manifest";

export type EnpageTemplateConfig = {
  datasources?: DatasourceManifestMap;
  attributes?: AttributesMap;
  settings?: TemplateSettings;
  manifest?: TemplateManifest;
};
