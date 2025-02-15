import { Type, type Static } from "@sinclair/typebox";

export const stylePreset = Type.Object(
  {
    style: Type.Union([
      Type.Literal("ghost", {
        title: "Ghost",
        description: "Minimal style with transparent background and no border",
      }),
      Type.Literal("classic", {
        title: "Classic",
        description: "Clean and professional look with subtle shadow and rounded corners",
      }),
      Type.Literal("modern", {
        title: "Modern",
        description: "Bold black borders with generous spacing and sharp corners",
      }),
      Type.Literal("soft", {
        title: "Soft",
        description: "Gentle curves and muted colors for a comfortable feel",
      }),
      Type.Literal("glass", {
        title: "Glass",
        description: "Translucent backdrop with blur effect for depth",
      }),
      Type.Literal("minimal", {
        title: "Minimal",
        description: "Simple and straightforward design with basic borders",
      }),
      Type.Literal("elevated", {
        title: "Elevated",
        description: "Floating appearance with shadow depth and no borders",
      }),
      Type.Literal("playful", {
        title: "Playful",
        description: "Fun dashed borders and light colors for engaging content",
      }),
      Type.Literal("professional", {
        title: "Professional",
        description: "Clean design with accent border for important content",
      }),
      Type.Literal("outlined", {
        title: "Outlined",
        description: "Simple outline with hover effect and no background",
      }),
      Type.Literal("paper", {
        title: "Paper",
        description: "Subtle texture and slight rotation for a paper-like appearance",
      }),
      Type.Literal("gradient", {
        title: "Gradient",
        description: "Smooth color transition background with soft edges",
      }),
      Type.Literal("nested", {
        title: "Nested",
        description: "Layered appearance with offset background",
      }),
      Type.Literal("callout", {
        title: "Callout",
        description: "Prominent style for important information or CTAs",
      }),
      Type.Literal("floating", {
        title: "Floating",
        description: "Hovering effect with dynamic shadow on interaction",
      }),
      Type.Literal("inset", {
        title: "Inset",
        description: "Pressed-in appearance with inner shadow",
      }),
    ]),
    variant: Type.Union([
      Type.Literal("primary", {
        title: "Primary",
        description: "Uses the theme primary color as the main color",
      }),
      Type.Literal("secondary", {
        title: "Secondary",
        description: "Uses the theme secondary color as the main color",
      }),
      Type.Literal("accent", {
        title: "Accent",
        description: "Uses the theme accent color as the main color",
      }),
      Type.Literal("neutral", {
        title: "Neutral",
        description: "Uses the theme neutral color as the main color",
      }),
    ]),
  },
  {
    "ui:field": "hidden",
  },
);

export type StylePreset = Static<typeof stylePreset>;

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:field": "hidden",
  }),
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
  stylePreset,
});

export const richText = Type.String({
  default: "some text here",
  // "ui:field": "rich-text",
  "ui:field": "hidden",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export const richTextHero = Type.String({
  default: "<h1>some text here</h1>",
  // "ui:field": "rich-text",
  "ui:field": "hidden",
  "ui:paragraph-mode": "hero",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export type RichText = Static<typeof richText>;

const imageProps = Type.Object(
  {
    src: Type.String({
      default: "https://placehold.co/400x200",
      title: "Image",
    }),
    alt: Type.String({
      title: "Alternate Text",
      description: "Alternative text for the image. Recommended for screen readers and SEO.",
      "ui:placeholder": "Your image description",
    }),
  },
  {
    "ui:group": "image",
    "ui:group:title": "Image",
    "ui:group:order": 1,
    "ui:field": "image",
    "ui:accept": "image/*",
    "ui:show-img-search": true,
    "ui:allow-url": true,
  },
);

export type ImageProps = Static<typeof imageProps>;

export const imageSettings = Type.Object(imageProps.properties, {
  default: {
    src: "https://placehold.co/400x200",
    alt: "my image",
  },
});

export type ImageSettings = Static<typeof imageSettings>;

export const contentAwareProps = Type.Object(
  {
    content: richText,
  },
  // {
  //   default: {
  //     content: {
  //       text: "some text here",
  //     },
  //   },
  // },
);

export const contentAwareHeroProps = Type.Object({
  content: richTextHero,
});

export const container = Type.Object({
  container: Type.Boolean({
    description:
      "True if the component is a container for other components. It is automatically set by the editor, so no need to specify it manually.",
    default: true,
  }),
});
