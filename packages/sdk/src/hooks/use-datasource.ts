import { DatasourceManifestMap } from "@enpage/types";
import { useRunContext } from "./use-run-context";
import z from "zod";

export function useDatasources<DS extends DatasourceManifestMap>() {
  const { data } = useRunContext<DS, {}>();
  return data;
}

export function useDatasource<DS extends DatasourceManifestMap>(
  key: keyof DS,
): z.infer<DS[keyof DS]["schema"]> | undefined;

export function useDatasource<DS extends DatasourceManifestMap>(
  key: keyof DS,
  defaultValue: z.infer<DS[keyof DS]["schema"]>,
): z.infer<DS[keyof DS]["schema"]>;

export function useDatasource<DS extends DatasourceManifestMap>(
  key: keyof DS,
  defaultValue?: z.infer<DS[keyof DS]["schema"]>,
) {
  const data = useDatasources<DS>();
  const datum = data[key];

  if (datum !== undefined) {
    return datum as z.infer<DS[keyof DS]["schema"]>;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return undefined;
}
