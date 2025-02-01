import { Value } from "@sinclair/typebox/value";
import { forwardRef, type ComponentProps } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/loop.manifest";

const Loop = forwardRef<HTMLDivElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const className = useBrickStyle(props);
  const { src, alt } = props;

  return (
    <div className={tx(apply("flex items-center justify-center h-full w-full"), className)} ref={ref}>
      Loop
    </div>
  );
});

export default Loop;
