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

  ssrManifest?: Manifest;
  templateManifest: TemplateManifest;
};

export type GenericPageConfig = PageConfig<DatasourceManifestMap, AttributesMap>;

export type PageContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = Pick<
  PageConfig<D, A>,
  "data" | "attr"
>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type GenericPageContext = PageContext<any, any>;
