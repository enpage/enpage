import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { defineAttributes, resolveAttributes, type AttributesResolved } from "./attributes";
import type { Brick } from "./bricks";
import type { TemplateConfig, ResolvedTemplateConfig } from "./template-config";
import invariant from "./utils/invariant";
import type { Theme } from "./theme";

export type PageBasicInfo = {
  id: string;
  siteId: string;
  label: string;
};

export type PagesMapEntry = {
  id: string;
  label: string;
  path: string;
  tags: string[];
};

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<
  D extends DatasourceManifestMap,
  A extends ResolvedTemplateConfig["attributes"],
  B extends Brick[],
> = {
  /**
   * The page id.
   */
  id: string;
  siteId: string;
  /**
   * Pathname to the page
   */
  path: string;
  /**
   * Label of the page
   */
  label: string;
  /**
   * Hostname of the site
   */
  hostname: string;

  /**
   * Map of all pages in the site.
   */
  pagesMap: PagesMapEntry[];
  /**
   * Data sources manifests for the page. Undefined if no data sources are defined.
   */
  datasources?: D;
  /**
   * Resolved static data sources for the page.
   * Undefined if no data sources are defined.
   */
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;

  /**
   * Page attributes.
   */
  attributes: A;
  /**
   * Resolved attributes for the page.
   */
  attr: AttributesResolved;
  bricks: B;

  theme: Theme;
};

export type GenericPageConfig = PageConfig<
  DatasourceManifestMap,
  ResolvedTemplateConfig["attributes"],
  Brick[]
>;

export type GenericPageContext = Omit<GenericPageConfig, "attributes">;

export type GenericSiteConfig = Omit<
  GenericPageConfig,
  "siteId" | "id" | "hostname" | "label" | "pagesMap"
> & {
  pagesMap: Omit<PagesMapEntry, "id">[];
};

export function createSiteConfigFromTemplateConfig(templateConfig: TemplateConfig, path = "/") {
  const bricks = templateConfig.pages.find((p) => p.path === path)?.bricks;
  invariant(bricks, `createPageConfigSampleFromTemplateConfig: No bricks found for path ${path}`);

  if (!templateConfig.attributes) {
    templateConfig.attributes = defineAttributes({});
  }

  return {
    pagesMap: templateConfig.pages.map((p) => ({
      id: crypto.randomUUID(),
      label: p.label,
      path: p.path,
      tags: p.tags,
    })),
    path,
    datasources: templateConfig.datasources,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    bricks,
    theme: templateConfig.themes[0],
  } satisfies GenericSiteConfig;
}

export type TemplatePage = {
  label: string;
  path: string;
  bricks: Brick[];
  tags: string[];
};

type DefinedTemplatePage = Omit<TemplatePage, "tags"> & {
  tags?: string[];
};

export function definePages(pages: DefinedTemplatePage[]): TemplatePage[] {
  return pages.map((p) => ({
    ...p,
    tags: p.tags ?? [],
  }));
}
