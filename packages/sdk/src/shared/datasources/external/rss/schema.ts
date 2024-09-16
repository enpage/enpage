import { Type, type Static } from "@sinclair/typebox";

export const rssSchema = Type.Object({
  title: Type.String({
    title: "Title",
    description: "The title of the RSS feed",
  }),
  link: Type.String({
    title: "Link",
    description: "The link to the RSS feed",
  }),
  description: Type.Optional(
    Type.String({
      title: "Description",
      description: "The description of the RSS feed",
    }),
  ),
  updated: Type.Optional(
    Type.String({
      title: "Updated",
      description: "The last updated date of the RSS feed",
    }),
  ),
  items: Type.Array(
    Type.Object({
      title: Type.Optional(
        Type.String({
          title: "Title",
          description: "The title of the RSS feed item",
        }),
      ),
      link: Type.Optional(
        Type.String({
          title: "Link",
          description: "The link to the RSS feed item",
        }),
      ),
      creator: Type.Optional(
        Type.String({
          title: "Creator",
          description: "The creator of the RSS feed item",
        }),
      ),
      content: Type.Optional(
        Type.String({
          title: "Content",
          description: "The content of the RSS feed item",
        }),
      ),
      pubDate: Type.Optional(
        Type.String({
          title: "Pub Date",
          description: "The publication date of the RSS feed item",
        }),
      ),
    }),
  ),
});

export type RssSchema = Static<typeof rssSchema>;
