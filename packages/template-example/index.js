// @ts-check
import { defineDataSources, enpage, z } from "@enpage/sdk";
import "@enpage/sdk/components";

defineDataSources({
  links: {
    name: "Links",
    schema: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        icon: z.string().optional(),
      }),
    ),
    sampleData: [
      { title: "Enpage", url: "https://enpage.io" },
      { title: "GitHub", url: "https://enpage.io/github" },
    ],
  },
  videos: {
    provider: "youtube",
    name: "My Videos",
    sampleData: [{ id: "dQw4w9WgXcQ" }, { id: "KMU0tzLwhbE" }],
    schema: z.object({
      id: z.string(),
    }),
  },
});
