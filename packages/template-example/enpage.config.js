// @ts-check
import z from "zod";
import { defineDataSources } from "@enpage/sdk/datasources";

// define you datasources likes this
export const datasources = defineDataSources({
  links: {
    name: "Links",
    schema: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
      }),
    ),
    sampleData: [
      { title: "Enpage", url: "https://enpage.io" },
      { title: "GitHub", url: "https://enpage.io/github" },
    ],
  },
  videos: {
    provider: "youtube-feed",
    name: "My Videos",
  },
});
