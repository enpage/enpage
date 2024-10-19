import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { resolveAttributes, type AttributesMap, type AttributesResolved } from "./attributes";
import type { Manifest } from "vite";
import type { TemplateManifest } from "./manifest";
import type { BricksContainer } from "./bricks";
import type { EnpageTemplateConfig } from "./template-config";

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<
  D extends DatasourceManifestMap | undefined,
  A extends AttributesMap,
  C extends BricksContainer[],
> = {
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
  attributes: AttributesMap;
  /**
   * Resolved attributes for the page.
   */
  attr: AttributesResolved<A>;
  containers: C;

  ssrManifest?: Manifest;

  /**
   * Template manifest
   */
  manifest: TemplateManifest;
};

export type GenericPageConfig = PageConfig<DatasourceManifestMap, AttributesMap, BricksContainer[]>;

export type PageContext<
  D extends DatasourceManifestMap | undefined,
  A extends AttributesMap,
  C extends BricksContainer[],
> = Pick<PageConfig<D, A, C>, "data" | "attr" | "containers">;

export type GenericPageContext = PageContext<DatasourceManifestMap, AttributesMap, BricksContainer[]>;

export function createPageConfigFromTemplateConfig(templateConfig: EnpageTemplateConfig): GenericPageConfig {
  return {
    datasources: templateConfig.datasources,
    data: undefined,
    attributes: templateConfig.attributes,
    attr: resolveAttributes(templateConfig.attributes),
    containers: templateConfig.containers,
    ssrManifest: {},
    manifest: templateConfig.manifest,
  };
}
