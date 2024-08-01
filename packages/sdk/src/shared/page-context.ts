import type { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import type { AttributesMap, AttributesResolved } from "./attributes";

/**
 * The Page Context represents the datasources and attributes resolved
 */
export type PageContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = {
  /**
   * Data sources for the page. Undefined if no data sources are defined.
   */
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;
  /**
   * Attributes for the page. Always defined because of Enpage default attributes.
   */
  attr: AttributesResolved<A>;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type GenericPageContext = PageContext<any, any>;
