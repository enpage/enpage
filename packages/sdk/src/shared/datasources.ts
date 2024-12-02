import type { DatasourcesMap } from "./datasources/types";
export { Type as ds, type TSchema } from "@sinclair/typebox";

export function defineDataSources<T extends DatasourcesMap>(datasources: T) {
  return datasources;
}
