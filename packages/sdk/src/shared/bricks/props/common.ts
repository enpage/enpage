import { Type, type Static } from "@sinclair/typebox";

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:field": "hidden",
  }),
  className: Type.String({
    default: "",
    "ui:field": "hidden",
  }),
});

export const editable = Type.Boolean({
  title: "Editable",
  description:
    "Allow editing of text content. It is automatically set by the editor, so no need to specify it manually.",
  default: false,
  "ui:field": "hidden",
});

export const multiline = Type.Boolean({
  title: "Multiline",
  description: "Allow multiple lines of text",
  default: false,
  "ui:field": "hidden",
});

export const mixedContent = Type.Intersect(
  [
    Type.Union([
      Type.Object({
        mode: Type.Literal("static"),
        text: Type.String(),
      }),
      Type.Object({
        mode: Type.Literal("dynamic"),
        datasourceId: Type.String(),
        datasourcePath: Type.String(),
      }),
    ]),
    Type.Object({
      multiline,
      editable,
    }),
  ],
  {
    default: {
      mode: "static",
      content: "some text here",
      multiline: false,
      editable: false,
    },
    title: "Content",
    description: "The text content",
    "ui:field": "mixed-content",
  },
);

export type MixedContent = Static<typeof mixedContent>;

export const contentAwareProps = Type.Object({
  content: mixedContent,
  // multiline,
  // editable,
});

export const container = Type.Object({
  container: Type.Boolean({
    description:
      "True if the component is a container for other components. It is automatically set by the editor, so no need to specify it manually.",
    default: true,
  }),
});
