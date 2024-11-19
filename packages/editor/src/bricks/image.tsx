import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "@enpage/style-system/twind";
import { commonProps } from "./props/common";
import { commonStyleProps } from "./props/style-props";
import { defineBrickManifest } from "@enpage/sdk/shared/bricks";
import { useBrickStyle } from "../hooks/use-brick-style";
import { LAYOUT_COLS } from "@enpage/sdk/shared/layout-constants";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "image",
  kind: "brick",
  title: "Image",
  description: "An image brick",
  preferredWidth: {
    mobile: LAYOUT_COLS.mobile / 2,
    desktop: LAYOUT_COLS.desktop / 4,
  },
  preferredHeight: {
    mobile: 6,
    desktop: 6,
  },
  minWidth: {
    mobile: 3,
    desktop: 3,
  },
  minHeight: {
    mobile: 3,
    desktop: 3,
  },
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
        "ui:field": "file",
        "ui:accept": "image/*",
        "ui:show-img-search": true,
      }),
      alt: Type.String({
        title: "Alternate Text",
        description: "Alternative text for the image. Recommended for screen readers and SEO.",
        "ui:placeholder": "Your image description",
      }),
    }),
    commonProps,
    commonStyleProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Image = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const className = useBrickStyle(props);
  const { src, alt } = props;

  return (
    <div className={tx(apply("flex items-center justify-center h-full w-full"), className)}>
      <img src={src} ref={ref} alt={alt} className={tx(apply("max-h-full min-w-1 min-h-1 brick-content"))} />
    </div>
  );
});

export default Image;
