import { Type, type Static } from "@sinclair/typebox";

export const threadsMediaSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      media_product_type: Type.Literal("THREADS"),
      media_type: Type.Union([
        Type.Literal("TEXT_POST"),
        Type.Literal("IMAGE"),
        Type.Literal("VIDEO"),
        Type.Literal("CAROUSEL_ALBUM"),
        Type.Literal("AUDIO"),
        Type.Literal("REPOST_FACADE"),
      ]),
      media_url: Type.String(),
      permalink: Type.String(),
      owner: Type.Object({
        id: Type.String(),
      }),
      username: Type.String(),
      text: Type.String(),
      timestamp: Type.String(),
      thumbnail_url: Type.String(),
      shortcode: Type.String(),
      is_quote_post: Type.Boolean(),
    }),
  ),
  paging: Type.Object({
    cursors: Type.Object({
      before: Type.String(),
      after: Type.String(),
    }),
  }),
});

export type ThreadsMediaSchema = Static<typeof threadsMediaSchema>;
