import { Type, type Static } from "@sinclair/typebox";

export const youtubeListSchema = Type.Object({
  etag: Type.String(),
  nextPageToken: Type.String(),
  regionCode: Type.String(),
  pageInfo: Type.Object({
    totalResults: Type.Number(),
    resultsPerPage: Type.Number(),
  }),
  items: Type.Array(
    Type.Object({
      etag: Type.String(),
      id: Type.Object({
        videoId: Type.String(),
        channelId: Type.String(),
        playlistId: Type.String(),
      }),
      snippet: Type.Object({
        publishedAt: Type.String(),
        channelId: Type.String(),
        title: Type.String(),
        description: Type.String(),
        thumbnails: Type.Object({
          default: Type.Object({
            url: Type.String(),
            width: Type.Number(),
            height: Type.Number(),
          }),
          standard: Type.Object({
            url: Type.String(),
            width: Type.Number(),
            height: Type.Number(),
          }),
        }),
        channelTitle: Type.String(),
        liveBroadcastContent: Type.String(),
      }),
    }),
  ),
});

export type YoutubeListSchema = Static<typeof youtubeListSchema>;
