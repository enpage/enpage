import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import TextBrick from "./text";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";

const Button = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  // if (!content.startsWith("<h")) {
  //   content = `<h1>${content}</h1>`;
  // }

  // const sizeClass = css({
  //   "font-size": `var(--${heroFontSize})`,
  // });

  return <TextBrick {...props} ref={ref} />;
});

export default Button;
