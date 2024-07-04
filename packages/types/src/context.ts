import { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { AttributesMap, AttributesResolved } from "./attributes";

export type PageContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap> = {
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;
  attributes: AttributesResolved<A>;
};
