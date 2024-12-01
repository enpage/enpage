import { Type } from "@sinclair/typebox";
import { manifestSchema } from "./manifest";
import { definedTemplatePage } from "./page";
import { themeSchema } from "./theme";
import { datasourcesMap } from "./datasources/types";

export const templateSchema = Type.Object(
  {
    manifest: manifestSchema,
    themes: Type.Array(themeSchema),
    datasources: Type.Optional(datasourcesMap),
    pages: Type.Array(definedTemplatePage),
  },
  {
    title: "Template schema",
    description: "The template configuration schema",
  },
);
