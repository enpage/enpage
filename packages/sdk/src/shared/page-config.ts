import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import type { AttributesMap, AttributesResolved } from "./attributes";
import type { Manifest } from "vite";

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
   * Resolved attributes for the page.
   */
  attributes: AttributesResolved<A>;

  siteConfig: Record<string, unknown>;
  ssrManifest?: Manifest;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type GenericPageConfig = PageConfig<any, any>;
