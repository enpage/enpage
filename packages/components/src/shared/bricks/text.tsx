import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "~/shared/hooks/use-editable-text";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import { tx } from "@upstart.gg/style-system/twind";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const newProps = { ...Value.Create(manifest).props, ...props };

  //return <NonEditableText ref={ref} {...newProps} />;
  return newProps.editable ? (
    <EditableText ref={ref} {...newProps} />
  ) : (
    <NonEditableText ref={ref} {...newProps} />
  );
});

const NonEditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  return (
    <div
      ref={ref}
      className={tx(className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
});

const EditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  const content = useEditableText({
    brickId: props.id,
    initialContent: props.content,
    inline: true,
    menuPlacement: "page",
    enabled: true,
  });
  return (
    <div ref={ref} className={tx(className)}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Text, "content");
