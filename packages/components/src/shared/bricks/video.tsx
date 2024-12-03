import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/video.manifest";

const Video = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  const { alt, className, id, ...attrs } = { ...Value.Create(manifest).props, ...props };
  return <img {...attrs} ref={ref} alt={alt} className={tx(apply("max-h-full"), className)} />;
});

export default Video;
