import { defineDataSources } from "./datasources";
import { defineAttributes } from "./attributes";
import { defineManifest } from "./manifest";
import { definePages } from "./page";
import { defineThemes } from "./theme";

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

/**
 * Define the template configuration
 */
export function defineConfig(config: TemplateConfig): ResolvedTemplateConfig {
  return {
    attributes: defineAttributes(config.attributes || {}),
    manifest: defineManifest(config.manifest),
    pages: definePages(config.pages),
    themes: defineThemes(config.themes),
    ...(config.datasources ? { datasources: defineDataSources(config.datasources) } : {}),
  };
}
