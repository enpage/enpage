import type { DatasourceManifestMap } from "./datasources";
import type { AttributesMap } from "./attributes";
import type { TemplateManifest } from "./manifest";

export type EnpageTemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest: TemplateManifest;
  /**
   * The attributes declared for the template
   */
  attributes: AttributesMap;
  /**
   * The datasources declared for the template
   */
  datasources?: DatasourceManifestMap;
};
