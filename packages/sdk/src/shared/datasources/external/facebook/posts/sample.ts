import type { FacebookPostSchema } from "./schema";

export const sample = {
  data: [
    {
      from: {
        name: "Facebook",
        id: "20531316728",
      },
      id: "20531316728_10154052815206729",
      permalink_url: "https://www.facebook.com/facebook/posts/10154052815206729",
      is_hidden: false,
      message: "Great photo!",
      object_id: "10154052815196729",
      link: "https://www.facebook.com/photo.php?fbid=10154052815196729&set=a.10150278999681729.345701.20531316728&type=3",
      is_published: true,
      status_type: "added_photos",
      type: "photo",
      actions: [
        {
          name: "Comment",
          link: "https://www.facebook.com/20531316728/posts/10154052815206729",
        },
        {
          name: "Like",
          link: "https://www.facebook.com/20531316728/posts/10154052815206729",
        },
      ],
    },
  ],
  paging: {
    next: "url",
    previous: "url",
  },
} satisfies FacebookPostSchema;
