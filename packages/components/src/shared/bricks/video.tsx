import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "@enpage/style-system/twind";
import { commonProps } from "./props/common";
import { defineBrickManifest } from "@enpage/sdk/shared/bricks";
import { LAYOUT_COLS } from "@enpage/sdk/shared/layout-constants";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  title: "Video",
  description: "Youtube video",
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
  // svg icon for "video" block
  icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect
    x="5" y="15"
    width="90" height="70"
    rx="20" ry="20"
    fill="transparent"
    stroke="currentColor"
    stroke-width="4"
  />
  <path
    d="M35 30 L35 70 L75 50 Z"
    fill="transparent"
    stroke="currentColor"
    stroke-width="4"
    stroke-linejoin="round"
  />
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
      }),
      alt: Type.String({
        title: "Alt Text",
        description: "Alternative text for the image",
        "ui:placeholder": "Your image description",
      }),
    }),
    commonProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Video = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  const { alt, className, id, ...attrs } = { ...Value.Create(manifest).props, ...props };
  return <img {...attrs} ref={ref} alt={alt} className={tx(apply("max-h-full"), className)} />;
});

export default Video;
