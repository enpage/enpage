import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import type { AttributesMap, AttributesResolved } from "./attributes";
import type { Manifest } from "vite";
import type { TemplateManifest } from "./manifest";

/**
 * The Page config represents the page configuration (datasources, attributes, etc)
 */
export type PageConfig<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = {
  /**
   * Data sources manifests for the page. Undefined if no data sources are defined.
   */
  datasources?: D;
  /**
   * Resolved Data sources for the page.
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
  attrs: AttributesResolved<A>;

  siteConfig: Record<string, unknown>;
  ssrManifest?: Manifest;
  templateManifest: TemplateManifest;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type GenericPageConfig = PageConfig<any, any>;
