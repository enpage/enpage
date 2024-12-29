import type { DatarecordsMap } from "./datarecords/types";

export function defineDataRecords<T extends DatarecordsMap>(datarecords: T) {
  return datarecords;
}
