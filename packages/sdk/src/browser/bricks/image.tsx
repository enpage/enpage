import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx } from "../twind";
import { generateId, getCommonBrickProps } from "./common";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "image",
  title: "Image",
  description: "An image brick",
  icon: "image",
  file: filename,
  props: Type.Object({
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
    ...getCommonBrickProps("max-w-full h-auto align-middle border-none"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Image = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  const { alt, className, brickId, ...attrs } = { ...Value.Create(manifest).props, ...props };
  return <img {...attrs} ref={ref} alt={alt} className={tx(className)} />;
});

export default Image;
