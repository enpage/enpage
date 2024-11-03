import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import DOMPurify from "dompurify";
import { forwardRef, useCallback } from "react";
import { tx } from "../twind";
import { commonBrickProps, editableTextProps, getHtmlAttributesAndRest } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "hero",
  title: "Hero",
  description: "A hero brick",
  // hero svg icon
  icon: `
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Background -->
  <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>
  <!-- Large Hero Text -->
  <rect x="20" y="35" width="60" height="12" rx="2" fill="currentColor"/>
  <rect x="20" y="52" width="40" height="12" rx="2" fill="currentColor"/>
</svg>
  `,
  file: filename,
  props: Type.Composite([editableTextProps, commonBrickProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Hero = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let {
    attributes,
    classes,
    rest: { textEditable, content },
  } = getHtmlAttributesAndRest(props);
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(attributes.id), []);

  if (!content.startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  return textEditable ? (
    <div className={tx("flex-1 relative", classes)}>
      <TextEditor
        // className={className}
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={attributes.id}
      />
    </div>
  ) : (
    <div
      ref={ref}
      className={tx("flex-1", classes)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
});

export default Hero;
