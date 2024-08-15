import { Type, type Static } from "@sinclair/typebox";

export const youtubeListSchema = Type.Object({
  kind: Type.String(),
  etag: Type.String(),
  nextPageToken: Type.String(),
  regionCode: Type.String(),
  pageInfo: Type.Object({
    totalResults: Type.Number(),
    resultsPerPage: Type.Number(),
  }),
  items: Type.Array(
    Type.Object({
      kind: Type.String(),
      etag: Type.String(),
      id: Type.Object({
        kind: Type.String(),
        videoId: Type.String(),
      }),
    }),
  ),
});

export type YoutubeListSchema = Static<typeof youtubeListSchema>;
