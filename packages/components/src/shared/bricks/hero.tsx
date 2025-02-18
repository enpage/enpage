import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import TextBrick from "./text";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";

const Hero = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content = "" } = props;

  if (!content.startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  const sizeClass = css({
    // "font-size": `var(--${heroFontSize})`,
  });

  return <TextBrick {...props} content={content} className={tx(props.className, sizeClass)} ref={ref} />;
});

export default Hero;
