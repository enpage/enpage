import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { resolveAttributes, type AttributesResolved } from "./attributes";
import type { Brick } from "./bricks";
import type { EnpageTemplateConfig } from "./template-config";
import invariant from "./utils/invariant";

export type PageBasicInfo = {
  id: string;
  siteId: string;
  label: string;
};

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<
  D extends DatasourceManifestMap,
  A extends EnpageTemplateConfig["attributes"],
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
  pagesMap: {
    id: string;
    label: string;
    path: string;
    tags: string[];
  }[];
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
};

export type GenericPageConfig = PageConfig<
  DatasourceManifestMap,
  EnpageTemplateConfig["attributes"],
  Brick[]
>;

export type GenericPageContext = Omit<GenericPageConfig, "attributes">;

export function createPageConfigSampleFromTemplateConfig(templateConfig: EnpageTemplateConfig, path = "/") {
  const bricks = templateConfig.pages.find((p) => p.path === path)?.bricks;
  invariant(bricks, `createPageConfigSampleFromTemplateConfig: No bricks found for path ${path}`);

  return {
    id: "page-1",
    siteId: "site-1",
    hostname: "localhost",
    label: "Page #1",
    pagesMap: [],
    path,
    datasources: templateConfig.datasources,
    data: undefined,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    bricks,
  } satisfies GenericPageConfig;
}

export type TemplatePage = {
  label: string;
  path: string;
  bricks: Brick[];
};

export function definePages(pages: TemplatePage[]) {
  return pages;
}
