import { Type, type Static } from "@sinclair/typebox";

export const commonProps = Type.Object({
  // id: Type.String({
  //   title: "Brick ID",
  //   "ui:field": "hidden",
  // }),
  className: Type.String({
    default: "",
    "ui:field": "hidden",
  }),
  lastTouched: Type.Number({
    default: 0,
    "ui:field": "hidden",
  }),
  editable: Type.Boolean({
    description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
    default: false,
    "ui:field": "hidden",
  }),
});

export const richText = Type.Boolean({
  title: "Rich Text",
  description: "Allow rich text",
  default: true,
  "ui:field": "hidden",
});

export const mixedContent = Type.Object(
  { richText, text: Type.String() },
  {
    default: {
      richText: true,
      text: "some text here",
    },
    "ui:field": "mixed-content",
    "ui:group": "content",
    "ui:group:title": "Content",
    "ui:group:order": 3,
  },
);

export type MixedContent = Static<typeof mixedContent>;

export const contentAwareProps = Type.Object(
  {
    content: mixedContent,
  },
  {
    default: {
      content: {
        text: "some text here",
        richText: true,
      },
    },
  },
);

export const container = Type.Object({
  container: Type.Boolean({
    description:
      "True if the component is a container for other components. It is automatically set by the editor, so no need to specify it manually.",
    default: true,
  }),
});
