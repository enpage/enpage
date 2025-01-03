import type { DatasourcesMap } from "./datasources/types";

export function defineDataSources<T extends DatasourcesMap>(datasources: T) {
  return datasources;
}
