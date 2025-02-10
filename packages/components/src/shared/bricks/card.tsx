import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";

const Card = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return (
    <div className="card" ref={ref}>
      {props.cardTitle?.content && <div className="card-title">{props.cardTitle.content}</div>}
      {props.cardBody?.content && <div className="card-body">{props.cardBody?.content}</div>}
    </div>
  );
});

export default Card;
