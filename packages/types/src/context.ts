import { DatasourceManifestMap, DatasourceResolved } from "./datasources";
import { AttributesMap, AttributesResolved } from "./attributes";

type PageMetadata = {
  title: string;
  metaTags: {
    name: string;
    content: string;
  }[];
};

export type PageContext<D extends DatasourceManifestMap | undefined, A extends AttributesMap | undefined> = {
  data?: D extends DatasourceManifestMap ? DatasourceResolved<D> : undefined;
  attributes?: A extends AttributesMap ? AttributesResolved<A> : undefined;
  page: PageMetadata;
};
