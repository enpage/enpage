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

const groupDimensions = {
  "ui:group": "dimensions",
  "ui:group:title": "Dimensions",
  "ui:group:order": 1,
};

const groupColors = {
  "ui:group": "colors",
  "ui:group:title": "Colors",
  "ui:group:order": 2,
};

export const borderWidth = Type.Union(
  [
    Type.Literal("border-0", { title: "None" }),
    Type.Literal("border", { title: "Small" }),
    Type.Literal("border-2", { title: "Medium" }),
    Type.Literal("border-4", { title: "Large" }),
    Type.Literal("border-8", { title: "Extra large" }),
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
    Type.Literal("rounded-sm", { title: "Small" }),
    Type.Literal("rounded-md", { title: "Medium" }),
    Type.Literal("rounded-lg", { title: "Large" }),
    Type.Literal("rounded-xl", { title: "Extra large" }),
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

export const borders = Type.Optional(
  Type.Object(
    {
      radius: borderRadius,
      style: borderStyle,
      color: borderColor,
      width: borderWidth,
    },
    {
      title: "Border style",
      "ui:field": "border",
      "ui:group": "borders",
      "ui:group:title": "Borders",
      default: {
        radius: "rounded-none",
        style: "border-solid",
        color: "#000000",
        width: "border-0",
      },
    },
  ),
);

export type BorderSettings = Static<typeof borders>;

export const padding = Type.Union(
  [
    Type.Literal("p-0", { title: "None" }),
    Type.Literal("p-2", { title: "Small" }),
    Type.Literal("p-4", { title: "Medium" }),
    Type.Literal("p-8", { title: "Large" }),
    Type.Literal("p-16", { title: "Extra large" }),
  ],
  {
    $id: "padding",
    default: "p-2",
    title: "Padding",
    description: "Space between the content and the border",
    "ui:field": "enum",
    "ui:display": "select",
    ...groupSpacing,
  },
);

export const dimensions = Type.Object(
  {
    height: Type.Optional(
      Type.Union([Type.Literal("fixed", { title: "Fixed" }), Type.Literal("auto", { title: "Auto" })]),
    ),
    padding: Type.Optional(padding),
  },
  {
    title: "Dimensions",
    "ui:field": "dimensions",
    ...groupDimensions,
    default: {
      padding: "p-2",
      height: "fixed",
    },
  },
);

export type DimensionsSettings = Static<typeof dimensions>;

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

export const background = Type.Object(
  {
    color: Type.Optional(
      Type.String({
        default: "transparent",
        title: "Color",
      }),
    ),
    image: Type.Optional(
      Type.String({
        default: "https://placehold.co/400x200",
        title: "Image",
      }),
    ),
    size: Type.Optional(
      Type.Union(
        [
          Type.Literal("auto", { title: "Auto" }),
          Type.Literal("cover", { title: "Cover" }),
          Type.Literal("contain", { title: "Contain" }),
        ],
        {
          default: "auto",
        },
      ),
    ),
  },
  {
    "ui:field": "background",
    "ui:group": "layout",
    "ui:show-img-search": true,
    title: "Background",
  },
);

export type BackgroundSettings = Static<typeof background>;

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
    Type.Literal("shadow-sm", { title: "Small" }),
    Type.Literal("shadow-md", { title: "Medium" }),
    Type.Literal("shadow-lg", { title: "Large" }),
    Type.Literal("shadow-xl", { title: "Extra large" }),
    Type.Literal("shadow-2xl", { title: "Extra large (2x)" }),
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

export const effects = Type.Optional(
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

export type EffectsSettings = Static<typeof effects>;

/**
 * No margin in common style props as bricks are usually placed in a grid
 */
export const commonStyleProps = Type.Object({
  // borderRadius,
  // borderWidth,
  // borderColor,
  // borderStyle,
  dimensions,
  borders,
  effects,
  // padding,
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
