import { Type, type Static } from "@sinclair/typebox";

export const facebookPostSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      from: Type.Object({
        name: Type.String(),
        id: Type.String(),
      }),
      id: Type.String(),
      permalink_url: Type.String(),
      is_hidden: Type.Boolean(),
      message: Type.Optional(Type.String()),
      object_id: Type.String(),
      link: Type.String(),
      is_published: Type.Boolean(),
      status_type: Type.String(),
      type: Type.String(),
      actions: Type.Array(
        Type.Object({
          name: Type.String(),
          link: Type.String(),
        }),
      ),
    }),
  ),
  paging: Type.Object({
    previous: Type.String(),
    next: Type.String(),
  }),
});

export type FacebookPostSchema = Static<typeof facebookPostSchema>;
