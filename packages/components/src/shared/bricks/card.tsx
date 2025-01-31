import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";

const Card = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return (
    <div className="card" ref={ref}>
      {typeof props.cardTitle?.content.text === "string" && (
        <div className="card-title">{props.cardTitle.content.text}</div>
      )}
      {typeof props.cardBody?.content.text === "string" && (
        <div className="card-body">{props.cardBody?.content.text}</div>
      )}
    </div>
  );
});

export default Card;
