import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "../twind";
import { commonBrickProps, getCommonHtmlAttributesAndRest } from "./common";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "image",
  title: "Image",
  description: "An image brick",
  preferredW: 4,
  preferredH: 8,
  // svg icon for "image" block
  icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,
  file: filename,
  props: Type.Composite([
    Type.Object({
      src: Type.String({
        default: "https://placehold.co/400x200",
        title: "File",
        description: "The image file",
        "ui:field": "file",
        "ui:accept": "image/*",
      }),
      alt: Type.String({
        title: "Alternate Text",
        description: "Alternative text for the image. Recommended for screen readers and SEO.",
        "ui:placeholder": "Your image description",
      }),
    }),
    commonBrickProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Image = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const {
    attributes,
    classes,
    rest: { alt, src },
  } = getCommonHtmlAttributesAndRest(props);

  return (
    <div className={tx(apply("flex items-center justify-center h-full w-full"), classes)}>
      <img
        {...attributes}
        src={src}
        ref={ref}
        alt={alt}
        className={tx(apply("max-h-full min-w-1 min-h-1"))}
      />
    </div>
  );
});

export default Image;
