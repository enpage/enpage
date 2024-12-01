import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "./manifests/image.manifest";

const Image = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const className = useBrickStyle(props);
  const { src, alt } = props;

  return (
    <div className={tx(apply("flex items-center justify-center h-full w-full"), className)}>
      <img
        src={src}
        ref={ref}
        alt={alt}
        className={tx(apply("max-h-full min-w-1 min-h-1 brick-content select-none pointer-events-none"))}
      />
    </div>
  );
});

export default Image;
