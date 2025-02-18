import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/countdown.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const CountDown = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return <div>Im a CountDown</div>;
});

export default CountDown;
