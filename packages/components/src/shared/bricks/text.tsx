import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "~/shared/hooks/use-editable-text";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const newProps = { ...Value.Create(manifest).props, ...props };
  console.log("rendering text", newProps);
  return <NonEditableText ref={ref} {...newProps} />;
  // return props.editable ? <EditableText ref={ref} {...props} /> : <NonEditableText ref={ref} {...props} />;
});

const NonEditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  console.log("rendering non-editable text", props);
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
    <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: props.content.text }} />
  );
});

const EditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  const content = useEditableText(props.id, props.content.text);
  console.log("rendering editable text", props);
  return (
    <div ref={ref} className={className}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Text, "content");
