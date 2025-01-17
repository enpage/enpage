import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/form.manifest";

const WidgetForm = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content } = props;

  if (!content.startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  return <div>Im a form</div>;
});

export default WidgetForm;
