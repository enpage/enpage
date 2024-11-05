import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { resolveAttributes, type AttributesResolved } from "./attributes";
import type { Manifest } from "vite";
import type { TemplateManifest } from "./manifest";
import type { Brick } from "./bricks";
import type { EnpageTemplateConfig } from "./template-config";

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

export function createPageConfigSampleFromTemplateConfig(templateConfig: EnpageTemplateConfig) {
  return {
    id: "page-1",
    siteId: "site-1",
    datasources: templateConfig.datasources,
    data: undefined,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    bricks: templateConfig.bricks,
    ssrManifest: {},
    manifest: templateConfig.manifest,
  };
}
