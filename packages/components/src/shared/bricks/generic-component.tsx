import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/generic-component.manifest";

const GenericComponent = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  // if (!content.startsWith("<h")) {
  //   content = `<h1>${content}</h1>`;
  // }

  // const sizeClass = css({
  //   "font-size": `var(--${heroFontSize})`,
  // });

  return <>{props.render(props)}</>;
});

export default GenericComponent;
