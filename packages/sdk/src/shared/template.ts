import { defineAttributes } from "./attributes";
import type { TemplateManifest } from "./manifest";
import type { TemplatePage } from "./page";
import type { Theme } from "./theme";
import type { DatasourcesMap } from "./datasources/types";

export type TemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest: TemplateManifest;
  /**
   * The attributes declared for the template
   */
  attributes?: ReturnType<typeof defineAttributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: DatasourcesMap;
  /**
   * The Pages
   */
  pages: TemplatePage[];
  /**
   * The themes declared by the site.
   */
  themes: Theme[];
};

export type ResolvedTemplateConfig = TemplateConfig & Required<Pick<TemplateConfig, "attributes">>;

/**
 * Define the template configuration
 */
export function defineConfig(config: TemplateConfig): ResolvedTemplateConfig {
  return {
    attributes: defineAttributes(config.attributes || {}),
    manifest: config.manifest,
    pages: config.pages.map((p) => ({
      ...p,
      tags: p.tags ?? [],
    })),
    themes: config.themes,
    ...(config.datasources ? { datasources: config.datasources } : {}),
  };
}
