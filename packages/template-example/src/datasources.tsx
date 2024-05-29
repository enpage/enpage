import { DatasourceManifestMap } from "@enpage/types";
import z from "zod";

// Datasources of the template
export const datasources = {
  links: {
    name: "Links",
    schema: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    ),
    sampleData: [
      { title: "Enpage", url: "https://enpage.io" },
      { title: "GitHub", url: "https://enpage.io/github" },
    ],
  },
} satisfies DatasourceManifestMap;

export type Datasources = typeof datasources;
