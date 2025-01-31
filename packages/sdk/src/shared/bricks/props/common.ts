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
  { text: Type.String(), richText: Type.Boolean() },
  {
    default: {
      text: "some text here",
    },
    "ui:field": "mixed-content",
    "ui:group": "content",
    "ui:group:title": "Content",
    "ui:group:order": 3,
  },
);

export type MixedContent = Static<typeof mixedContent>;

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

export const imageSettings = Type.Object(
  {
    image: imageProps,
  },
  {
    default: {
      image: {
        src: "https://placehold.co/400x200",
        alt: "my image",
      },
    },
  },
);

export type ImageSettings = Static<typeof imageSettings>;

export const contentAwareProps = Type.Object(
  {
    content: mixedContent,
  },
  {
    default: {
      content: {
        text: "some text here",
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
