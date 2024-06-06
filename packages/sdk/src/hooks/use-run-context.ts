import { createContext, useContext } from "react";
import type { Editor, TemplateProps } from "../types";
import type { AttributesMap, DatasourceManifestMap } from "@enpage/types";
import { type CSSRegistry, registry } from "../dynamic-css";

export type RunContextType<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
> = TemplateProps<Datasources, Settings> & {
  mode: "edit" | "view";
  cssRegistry: CSSRegistry;
};

export const RunContext = createContext<RunContextType>({
  mode: "view",
  data: {},
  attributes: {},
  styles: {},
  cssRegistry: registry,
});

export function useRunContext<
  Datasources extends DatasourceManifestMap = {},
  Settings extends AttributesMap = {},
>() {
  return useContext(RunContext) as RunContextType<Datasources, Settings>;
}
