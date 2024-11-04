import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "../twind";
import { generateId, commonBrickProps } from "./common";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "video",
  title: "Video",
  description: "A video element",
  // svg icon for "video" block
  icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect
    x="5" y="5"
    width="90" height="90"
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
    commonBrickProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Video = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  const { alt, className, id, ...attrs } = { ...Value.Create(manifest).props, ...props };
  return <img {...attrs} ref={ref} alt={alt} className={tx(apply("max-h-full"), className)} />;
});

export default Video;
