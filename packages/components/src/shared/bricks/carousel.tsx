import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/carousel.manifest";

const Carousel = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return <div>Im a card</div>;
});

export default Carousel;
