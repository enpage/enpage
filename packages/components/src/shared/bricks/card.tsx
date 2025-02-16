import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import TextBrick from "./text";

const Card = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return (
    <div className={tx("card flex flex-col")} ref={ref}>
      {props.cardTitle?.content && (
        <TextBrick
          {...props}
          content={props.cardTitle.content}
          className={tx(props.className, "card-title flex-1")}
        />
      )}
      {props.cardBody?.content && (
        <TextBrick
          {...props}
          content={props.cardBody.content}
          className={tx(props.className, "card-body flex-1")}
        />
      )}
    </div>
  );
});

export default Card;
