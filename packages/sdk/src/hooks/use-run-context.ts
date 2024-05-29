import { createContext, useContext, type Context } from "react";
import type { TemplateProps } from "../types";
import { AttributesMap, DatasourceManifestMap } from "@enpage/types";

export type RunContextType<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
> = TemplateProps<Datasources, Settings> &
  (
    | {
        mode: "edit";
        onSelectBlock?: (blockId: string) => void;
      }
    | {
        mode: "view";
        onSelectBlock?: never;
      }
  );

export const RunContext = createContext<RunContextType>({
  mode: "view",
  data: {},
  attributes: {},
  styles: {},
});

export function useRunContext<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
>() {
  return useContext(RunContext) as RunContextType<Datasources, Settings>;
}
