import { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { AttributesMap, AttributesResolved } from "./attributes";

/**
 * The Site Context represents the data needed to build/render a page.
 */
export type SiteContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = {
  /**
   * Data sources for the page. Undefined if no data sources are defined.
   */
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;
  /**
   * Attributes for the page. Always defined because of Enpage default attributes.
   */
  attributes: AttributesResolved<A>;
};
