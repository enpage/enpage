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

export const mixedContent = Type.Object(
  { multiline, editable, text: Type.String() },
  {
    default: {
      mode: "static",
      content: "some text here",
      multiline: false,
      editable: false,
    },
    "ui:field": "mixed-content",
    "ui:group": "content",
    "ui:group:title": "Content",
  },
);

export type MixedContent = Static<typeof mixedContent>;

export const contentAwareProps = Type.Object({
  content: mixedContent,
});

export const container = Type.Object({
  container: Type.Boolean({
    description:
      "True if the component is a container for other components. It is automatically set by the editor, so no need to specify it manually.",
    default: true,
  }),
});
