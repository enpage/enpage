import { Type } from "@sinclair/typebox";

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:widget": "hidden",
  }),
  // hack to allow passing a class name between bricks, such as Hero -> Text
  className: Type.Optional(
    Type.String({
      default: "",
      "ui:widget": "hidden",
    }),
  ),
  z: Type.Optional(
    Type.Number({
      title: "Z-index",
      "ui:widget": "hidden",
    }),
  ),
});

export const content = Type.String({
  default: "Click to edit",
  title: "Content",
  description: "The text content",
  "ui:widget": "hidden",
});

export const contentAwareProps = Type.Object({
  content,
});
