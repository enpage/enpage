import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  return <div>Im a footer</div>;
});

export default Footer;
