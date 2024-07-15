import type { DatasourceProvider, providersSchemaMap } from "./datasources";
import type z from "zod";

export const providersSamples: Record<DatasourceProvider, unknown> = {
  "youtube-video": {
    id: "dQw4w9WgXcQ",
    publishedAt: "2009-10-25",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  } as z.infer<(typeof providersSchemaMap)["youtube-video"]>,
  "youtube-feed": [
    {
      id: "dQw4w9WgXcQ",
      publishedAt: "2009-10-25",
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    },
    {
      id: "6YzGOq42zLk",
      publishedAt: "2011-11-15",
      title: 'Gotye performing "Somebody That I Used To Know" Live on KCRW',
    },
    {
      id: "RBumgq5yVrA",
      publishedAt: "2012-07-26",
      title: "Passenger | Let Her Go (Official Video)",
    },
  ] as z.infer<(typeof providersSchemaMap)["youtube-feed"]>,
  tweet: {
    id: "440322224407314432",
    publishedAt: "2014-03-03",
  } as z.infer<(typeof providersSchemaMap)["tweet"]>,
  "twitter-feed": [
    {
      id: "440322224407314432",
      publishedAt: "2014-03-03",
    },
    {
      id: "849813577770778624",
      publishedAt: "2017-04-06",
    },
    {
      id: "1749500209061663043",
      publishedAt: "2024-01-22",
    },
  ] as z.infer<(typeof providersSchemaMap)["twitter-feed"]>,
};
