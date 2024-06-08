import { createContext } from "@lit/context";
import type { DataTemplateProp } from "./types";
import type { DatasourceManifestMap } from "@enpage/types";

export type EnpageContext = DataTemplateProp<DatasourceManifestMap>;
export const enpageContext = createContext<EnpageContext>("enpage-context");
