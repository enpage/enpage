import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "~/shared/hooks/use-editable-text";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "./manifests/text.manifest";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  return props.editable ? <EditableText ref={ref} {...props} /> : <NonEditableText ref={ref} {...props} />;
});

const NonEditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  return (
    <div ref={ref} className={className}>
      {props.content}
    </div>
  );
});

const EditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  const content = useEditableText(props.id, props.content);
  return (
    <div ref={ref} className={className}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Text, "content");
