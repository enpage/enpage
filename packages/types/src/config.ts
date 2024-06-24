import type { DatasourceManifestMap } from "@enpage/types/datasources";
import type { AttributesMap } from "@enpage/types/attributes";
import type { TemplateSettings } from "@enpage/types/template-settings";
import type { TemplateInfo } from "./template-info";

export type EnpageTemplateConfig = {
  datasources?: DatasourceManifestMap;
  attributes?: AttributesMap;
  settings?: TemplateSettings;
  info?: TemplateInfo;
};
