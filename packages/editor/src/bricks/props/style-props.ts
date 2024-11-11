import { Type, type Static } from "@sinclair/typebox";
import { tx } from "@enpage/style-system/twind";

const borderWidth = Type.Union(
  [
    Type.Literal("border-0", { title: "None" }),
    Type.Literal("border", { title: "S" }),
    Type.Literal("border-2", { title: "M" }),
    Type.Literal("border-4", { title: "L" }),
    Type.Literal("border-8", { title: "XL" }),
  ],
  {
    default: "border-0",
    title: "Border width",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "border",
  },
);

const borderColor = Type.String({
  default: "transparent",
  title: "Border color",
  "ui:field": "color",
  "ui:color-attr": "border-color",
  "ui:group": "border",
});

const borderStyle = Type.Union(
  [
    Type.Literal("border-solid", { title: "Solid" }),
    Type.Literal("border-dashed", { title: "Dashed" }),
    Type.Literal("border-dotted", { title: "Dotted" }),
  ],
  {
    default: "border-solid",
    title: "Border style",
    description: "The brick border style",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "border",
  },
);

const borderRadius = Type.Union(
  [
    Type.Literal("rounded-none", { title: "None" }),
    Type.Literal("rounded-sm", { title: "S" }),
    Type.Literal("rounded-md", { title: "M" }),
    Type.Literal("rounded-lg", { title: "L" }),
    Type.Literal("rounded-xl", { title: "XL" }),
    Type.Literal("rounded-full", { title: "Full" }),
  ],
  {
    default: "rounded-none",
    title: "Rounding",
    description: "Corners rounding",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "border",
  },
);

const padding = Type.Union(
  [
    Type.Literal("p-0", { title: "None" }),
    Type.Literal("p-2", { title: "S" }),
    Type.Literal("p-4", { title: "M" }),
    Type.Literal("p-8", { title: "L" }),
    Type.Literal("p-16", { title: "XL" }),
  ],
  {
    default: "p-2",
    title: "Padding",
    description: "Space between the content and the border",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "spacing",
  },
);

const margin = Type.Union(
  [
    Type.Literal("m-0", { title: "0" }),
    Type.Literal("m-1", { title: "1" }),
    Type.Literal("m-2", { title: "2" }),
    Type.Literal("m-4", { title: "3" }),
    Type.Literal("m-8", { title: "4" }),
    Type.Literal("m-16", { title: "5" }),
    Type.Literal("m-32", { title: "6" }),
    Type.Literal("m-auto", { title: "Auto" }),
  ],
  {
    default: "m-0",
    title: "Margin",
    description: "Outside space around the brick",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "spacing",
  },
);

const backgroundColor = Type.String({
  default: "transparent",
  title: "Background color",
  "ui:field": "color",
  "ui:color-attr": "background-color",
  "ui:group": "colors",
});

const opacity = Type.Number({
  minimum: 0,
  maximum: 100,
  default: 100,
  title: "Opacity",
  description: "Global opacity",
  "ui:field": "slider",
  "ui:group": "effects",
});

const shadow = Type.Union(
  [
    Type.Literal("shadow-none", { title: "None" }),
    Type.Literal("shadow-sm", { title: "S" }),
    Type.Literal("shadow-md", { title: "M" }),
    Type.Literal("shadow-lg", { title: "L" }),
    Type.Literal("shadow-xl", { title: "XL" }),
    Type.Literal("shadow-2xl", { title: "2XL" }),
  ],
  {
    default: "shadow-none",
    title: "Shadow",
    description: "Shadow",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "effects",
  },
);

/**
 * No margin in common style props as bricks are usually placed in a grid
 */
export const commonStyleProps = Type.Object({
  borderRadius,
  borderWidth,
  borderColor,
  borderStyle,
  padding,
  backgroundColor,
  opacity,
  shadow,
});

const textAlign = Type.Optional(
  Type.Union(
    [
      Type.Literal("text-left", { title: "Left", description: "Left align" }),
      Type.Literal("text-center", { title: "Center", description: "Center align" }),
      Type.Literal("text-right", { title: "Right", description: "Right align" }),
      Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
    ],
    {
      default: "text-left",
      title: "Text alignment",
      description: "The text alignment",
      "ui:field": "enum",
      "ui:group": "text",
    },
  ),
);

const fontSize = Type.Union(
  [
    Type.Literal("text-xs", { title: "XS" }),
    Type.Literal("text-sm", { title: "S" }),
    Type.Literal("text-base", { title: "M" }),
    Type.Literal("text-lg", { title: "L" }),
    Type.Literal("text-xl", { title: "XL" }),
    Type.Literal("text-2xl", { title: "2XL" }),
    Type.Literal("text-3xl", { title: "3XL" }),
    Type.Literal("text-4xl", { title: "4XL" }),
    Type.Literal("text-5xl", { title: "5XL" }),
    Type.Literal("text-6xl", { title: "6XL" }),
    Type.Literal("text-7xl", { title: "7XL" }),
  ],
  {
    default: "text-base",
    title: "Font size",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "text",
  },
);

const fontWeight = Type.Union(
  [
    Type.Literal("font-normal", { title: "1" }),
    Type.Literal("font-medium", { title: "2" }),
    Type.Literal("font-semibold", { title: "3" }),
    Type.Literal("font-bold", { title: "4" }),
    Type.Literal("font-extrabold", { title: "5" }),
  ],
  {
    default: "font-normal",
    title: "Font weight",
    description: "The text font weight",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "text",
  },
);

const color = Type.String({
  default: "transparent",
  title: "Text color",
  "ui:field": "color",
  "ui:color-attr": "text-color",
  "ui:group": "text",
});

export const textStyleProps = Type.Object({
  color,
  textAlign,
  fontSize,
  fontWeight,
});
