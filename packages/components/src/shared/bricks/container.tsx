import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/container.manifest";

const Container = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const className = useBrickStyle(props);

  console.log("className", className);

  return (
    <div className={tx(apply("flex"), className)} ref={ref}>
      {props.children.length > 0 ? (
        props.children.map((brick) => {
          return (
            <div key={brick.id}>
              {brick.type} {brick.id}
            </div>
          );
        })
      ) : (
        <>
          <div className="border border-dotted p-2 flex-1">Drag a brick here</div>
          <div className="border border-dotted p-2 flex-1">and another there</div>
        </>
      )}
    </div>
  );
});

export default Container;
