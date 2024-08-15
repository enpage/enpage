import { Type, type Static } from "@sinclair/typebox";

export const rssSchema = Type.Object({
  title: Type.String(),
  link: Type.String(),
  description: Type.String(),
  items: Type.Array(
    Type.Object({
      title: Type.String(),
      link: Type.String(),
      pubDate: Type.String(),
      content: Type.String(),
    }),
  ),
});

export type RssSchema = Static<typeof rssSchema>;
