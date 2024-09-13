import { Type, type Static } from "@sinclair/typebox";

export const faq = Type.Array(
  Type.Object({
    question: Type.String({
      description: "Question",
    }),
    answer: Type.String({
      description: "Answer",
    }),
    category: Type.Optional(
      Type.String({
        description: "Category",
      }),
    ),
    tags: Type.Optional(Type.Array(Type.String(), { description: "Tags" })),
  }),
);

export type Faq = Static<typeof faq>;
