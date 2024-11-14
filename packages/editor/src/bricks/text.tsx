import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { commonProps, contentAwareProps } from "./props/common";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "./hooks/use-editable-text";
import { useBrickStyle } from "./hooks/use-brick-style";
import { commonStyleProps } from "./props/style-props";
import { defineBrickManifest } from "@enpage/sdk/shared/bricks";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  title: "Text",
  description: "Text with formatting options",
  preferredW: 6,
  preferredH: 10,
  // svg icon for "text" block
  icon: `
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7h16M4 12h16M4 17h16"></path>
    </svg>
 `,
  file: filename,
  props: Type.Composite([commonProps, contentAwareProps, commonStyleProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
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
