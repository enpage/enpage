import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import TextBrick from "./text";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";

const Hero = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const { content } = props;
  let { text } = content;

  if (!text.startsWith("<h")) {
    text = `<h1>${content.text}</h1>`;
  }

  const sizeClass = css({
    // "font-size": `var(--${heroFontSize})`,
  });

  return <TextBrick {...props} content={{ ...content, text }} className={tx(sizeClass)} ref={ref} />;
});

export default Hero;
