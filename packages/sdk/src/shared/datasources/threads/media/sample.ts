import type { ThreadsMediaSchema } from "./schema";

export const sample = {
  data: [
    {
      id: "1",
      is_quote_post: false,
      media_product_type: "THREADS",
      media_type: "IMAGE",
      media_url: "https://example.com/image.jpg",
      owner: {
        id: "1",
      },
      permalink: "https://example.com/post",
      shortcode: "123456",
      text: "Hello, world!",
      thumbnail_url: "https://example.com/thumbnail.jpg",
      timestamp: "2022-01-01T00:00:00Z",
      username: "example",
    },
    {
      id: "2",
      is_quote_post: false,
      media_product_type: "THREADS",
      media_type: "VIDEO",
      media_url: "https://example.com/video.mp4",
      owner: {
        id: "2",
      },
      permalink: "https://example.com/post",
      shortcode: "654321",
      text: "Goodbye, world!",
      thumbnail_url: "https://example.com/thumbnail.jpg",
      timestamp: "2022-01-02T00:00:00Z",
      username: "example",
    },
  ],
  paging: {
    cursors: {
      before: "",
      after: "",
    },
  },
} satisfies ThreadsMediaSchema;
