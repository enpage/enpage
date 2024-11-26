import type { defineDataSources } from "./datasources";
import type { defineAttributes } from "./attributes";
import type { defineManifest } from "./manifest";
import type { definePages } from "./page";
import type { defineThemes } from "./theme";

export type TemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest: ReturnType<typeof defineManifest>;
  /**
   * The attributes declared for the template
   */
  attributes?: ReturnType<typeof defineAttributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: ReturnType<typeof defineDataSources>;
  /**
   * The Pages
   */
  pages: ReturnType<typeof definePages>;
  /**
   * The themes declared by the site.
   */
  themes: ReturnType<typeof defineThemes>;
};

export type ResolvedTemplateConfig = TemplateConfig & Required<Pick<TemplateConfig, "attributes">>;
