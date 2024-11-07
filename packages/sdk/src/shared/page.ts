import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { resolveAttributes, type AttributesResolved } from "./attributes";
import type { Manifest } from "vite";
import type { TemplateManifest } from "./manifest";
import { defineBricks, type Brick, type DefinedBrick } from "./bricks";
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
  D extends DatasourceManifestMap | undefined,
  A extends EnpageTemplateConfig["attributes"],
  B extends Brick[],
> = {
  id: string;
  siteId: string;
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

  ssrManifest?: Manifest;

  /**
   * Template manifest
   */
  manifest: TemplateManifest;
};

export type GenericPageConfig = PageConfig<
  DatasourceManifestMap,
  EnpageTemplateConfig["attributes"],
  Brick[]
>;

export type PageContext<
  D extends DatasourceManifestMap | undefined,
  A extends EnpageTemplateConfig["attributes"],
  B extends Brick[],
> = Pick<PageConfig<D, A, B>, "data" | "attr" | "bricks">;

export type GenericPageContext = PageContext<
  DatasourceManifestMap,
  EnpageTemplateConfig["attributes"],
  Brick[]
>;

export function createPageConfigSampleFromTemplateConfig(templateConfig: EnpageTemplateConfig, path = "/") {
  const bricks = templateConfig.pages.find((p) => p.path === path)?.bricks;
  invariant(bricks, `createPageConfigSampleFromTemplateConfig: No bricks found for path ${path}`);

  return {
    id: "page-1",
    siteId: "site-1",
    datasources: templateConfig.datasources,
    data: undefined,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    bricks,
    ssrManifest: {},
    manifest: templateConfig.manifest,
  };
}

export type TemplatePage = {
  label: string;
  path: string;
  bricks: Brick[];
};

export function definePages(pages: TemplatePage[]): TemplatePage[] {
  return pages;
}
