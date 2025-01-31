import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/form.manifest";

const WidgetForm = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let {
    content: { text },
  } = props;

  if (!text.startsWith("<h")) {
    text = `<h1>${text}</h1>`;
  }

  return <div>Im a form</div>;
});

export default WidgetForm;
