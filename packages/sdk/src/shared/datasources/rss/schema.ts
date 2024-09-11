import { Type, type Static } from "@sinclair/typebox";

export const rssSchema = Type.Object({
  title: Type.String(),
  link: Type.String(),
  description: Type.Optional(Type.String()),
  updated: Type.Optional(Type.String()),
  items: Type.Array(
    Type.Object({
      title: Type.Optional(Type.String()),
      link: Type.Optional(Type.String()),
      creator: Type.Optional(Type.String()),
      content: Type.Optional(Type.String()),
      pubDate: Type.Optional(Type.String()),
    }),
  ),
});

export type RssSchema = Static<typeof rssSchema>;
