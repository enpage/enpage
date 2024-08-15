import { Type, type Static } from "@sinclair/typebox";

export const instagramFeedSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      caption: Type.String(),
      timestamp: Type.String(),
      media_url: Type.String(),
      permalink: Type.String(),
      media_type: Type.Union([Type.Literal("IMAGE"), Type.Literal("VIDEO"), Type.Literal("CAROUSEL_ALBUM")]),
    }),
  ),
  paging: Type.Object({
    cursors: Type.Object({
      before: Type.String(),
      after: Type.String(),
    }),
    next: Type.String(),
  }),
});

export type InstagramFeedSchema = Static<typeof instagramFeedSchema>;
