import type { DatasourceManifestMap } from "@enpage/types/datasources";
export { default as z } from "zod";

let datasources: DatasourceManifestMap | undefined;

export function defineDataSources(datasources: DatasourceManifestMap) {
  return datasources;
}

export function getContext() {
  return datasources;
}
