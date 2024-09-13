import { Type, type Static } from "@sinclair/typebox";

export const links = Type.Array(
  Type.Object({
    // required fields
    url: Type.String({ format: "uri", description: "URL" }),
    title: Type.String({ description: "Title" }),
    // optional fields
    description: Type.Optional(Type.String({ description: "Description" })),
    icon: Type.Optional(Type.String({ description: "Icon" })),
  }),
);

export type Links = Static<typeof links>;
