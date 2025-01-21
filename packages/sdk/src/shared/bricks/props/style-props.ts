import { Type, type Static } from "@sinclair/typebox";

const groupBorder = {
  "ui:group": "border",
  "ui:group:title": "Border",
};

const groupSpacing = {
  "ui:group": "spacing",
  "ui:group:title": "Spacing",
};

const groupEffects = {
  "ui:group": "effects",
  "ui:group:title": "Effects",
};

const groupColors = {
  "ui:group": "colors",
  "ui:group:title": "Colors",
};

export const borderWidth = Type.Union(
  [
    Type.Literal("border-0", { title: "None" }),
    Type.Literal("border", { title: "S" }),
    Type.Literal("border-2", { title: "M" }),
    Type.Literal("border-4", { title: "L" }),
    Type.Literal("border-8", { title: "XL" }),
  ],
  {
    $id: "borderWidth",
    default: "border-0",
    title: "Border width",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const borderColor = Type.String({
  $id: "borderColor",
  default: "transparent",
  title: "Border color",
  "ui:field": "color",
  "ui:color-type": "border",
  ...groupBorder,
});

export const borderStyle = Type.Union(
  [
    Type.Literal("border-solid", { title: "Solid" }),
    Type.Literal("border-dashed", { title: "Dashed" }),
    Type.Literal("border-dotted", { title: "Dotted" }),
  ],
  {
    $id: "borderStyle",
    default: "border-solid",
    title: "Border style",
    description: "The brick border style",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const borderRadius = Type.Union(
  [
    Type.Literal("rounded-none", { title: "None" }),
    Type.Literal("rounded-sm", { title: "S" }),
    Type.Literal("rounded-md", { title: "M" }),
    Type.Literal("rounded-lg", { title: "L" }),
    Type.Literal("rounded-xl", { title: "XL" }),
    Type.Literal("rounded-full", { title: "Full" }),
  ],
  {
    $id: "borderRadius",
    default: "rounded-none",
    title: "Rounding",
    description: "Corners rounding",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const borderSettings = Type.Optional(
  Type.Object(
    {
      rounding: borderRadius,
      style: borderStyle,
      color: borderColor,
      width: borderWidth,
    },
    {
      title: "Border style",
      "ui:field": "border",
      "ui:group": "Border",
      "ui:group:title": "Border",
      default: {
        rounding: "rounded-none",
        style: "border-solid",
        color: "#000000",
        width: "border-0",
      },
    },
  ),
);

export type BorderSettings = Static<typeof borderSettings>;

export const padding = Type.Union(
  [
    Type.Literal("p-0", { title: "None" }),
    Type.Literal("p-2", { title: "S" }),
    Type.Literal("p-4", { title: "M" }),
    Type.Literal("p-8", { title: "L" }),
    Type.Literal("p-16", { title: "XL" }),
  ],
  {
    $id: "padding",
    default: "p-2",
    title: "Padding",
    description: "Space between the content and the border",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupSpacing,
  },
);

/**
 * We don't manage margins yet (users have to move bricks over the grid to handle margins)
 */
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
    ...groupSpacing,
  },
);

export const backgroundColor = Type.String({
  $id: "backgroundColor",
  default: "transparent",
  title: "Background color",
  "ui:field": "color",
  "ui:color-type": "background",
  ...groupColors,
});

const opacity = Type.Optional(
  Type.Number({
    $id: "opacity",
    minimum: 0.1,
    maximum: 1,
    default: 1,
    multipleOf: 0.1,
    title: "Opacity",
    description: "Global opacity",
    "ui:field": "slider",
    ...groupEffects,
  }),
);

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
    $id: "shadow",
    default: "shadow-none",
    title: "Shadow",
    description: "Shadow",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupEffects,
  },
);

export const effectsSettings = Type.Optional(
  Type.Object(
    {
      shadow,
      opacity,
    },
    {
      title: "Effects",
      "ui:field": "effects",
      "ui:group": "effects",
      "ui:group:title": "Effects",
      default: {
        shadow: "shadow-none",
        opacity: 1,
      },
    },
  ),
);

export type EffectsSettings = Static<typeof effectsSettings>;

/**
 * No margin in common style props as bricks are usually placed in a grid
 */
export const commonStyleProps = Type.Object({
  // borderRadius,
  // borderWidth,
  // borderColor,
  // borderStyle,
  borderSettings,
  effectsSettings,
  padding,
  backgroundColor,
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
      $id: "textAlign",
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
    $id: "fontSize",
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
    $id: "fontWeight",
    default: "font-normal",
    title: "Font weight",
    description: "The text font weight",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "text",
  },
);

export const color = Type.String({
  $id: "color",
  default: "transparent",
  title: "Text color",
  "ui:field": "color",
  "ui:color-type": "text",
  "ui:group": "text",
});

export const textStyleProps = Type.Object({
  color,
  textAlign,
  fontSize,
  fontWeight,
});
