import { Type } from "@sinclair/typebox";

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:widget": "hidden",
  }),
  className: Type.String({
    default: "",
    "ui:widget": "hidden",
  }),
  datasourceId: Type.Optional(
    Type.String({
      title: "Data Source",
    }),
  ),
  datasourcePath: Type.Optional(
    Type.String({
      title: "Data Source Path",
    }),
  ),
});

export const content = Type.String({
  default: "Click to edit",
  title: "Content",
  description: "The text content",
  // "ui:widget": "hidden",
});

export const editable = Type.Boolean({
  title: "Editable",
  description:
    "Allow editing of text content. It is automatically set by the editor, so no need to specify it manually.",
  default: false,
  "ui:widget": "hidden",
});

export const contentAwareProps = Type.Object({
  content,
  editable,
});

export const container = Type.Object({
  container: Type.Boolean({
    description:
      "True if the component is a container for other components. It is automatically set by the editor, so no need to specify it manually.",
    default: true,
  }),
});
