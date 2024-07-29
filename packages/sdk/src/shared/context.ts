import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import type { AttributesMap, AttributesResolved } from "./attributes";
import type { Manifest } from "vite";

/**
 * The Site Context represents the data needed to build/render a page.
 */
export type PageContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = {
  /**
   * Data sources for the page. Undefined if no data sources are defined.
   */
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;
  /**
   * Attributes for the page. Always defined because of Enpage default attributes.
   */
  attributes: AttributesResolved<A>;

  siteConfig: Record<string, unknown>;

  ssrManifest?: Manifest;
};
