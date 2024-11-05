import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import DOMPurify from "dompurify";
import { forwardRef, useCallback } from "react";
import { tx, css } from "../twind";
import { commonBrickProps, editableTextProps, getCommonHtmlAttributesAndRest } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "hero",
  title: "Hero",
  description: "A big textual element for home pages",
  preferredW: 12,
  preferredH: 6,
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
  props: Type.Composite([
    editableTextProps,
    commonBrickProps,
    Type.Object({
      size: Type.Union(
        [
          Type.Literal("font-size-hero-1", { title: "1" }),
          Type.Literal("font-size-hero-2", { title: "2" }),
          Type.Literal("font-size-hero-3", { title: "3" }),
          Type.Literal("font-size-hero-4", { title: "4" }),
          Type.Literal("font-size-hero-5", { title: "5" }),
        ],
        {
          default: "font-size-hero-3",
          title: "Font size",
          description: "The font size",
          "ui:field": "enum",
          "ui:display": "button-group",
          "ui:group": "border",
        },
      ),
    }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Hero = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let {
    attributes,
    classes,
    rest: { textEditable, content },
  } = getCommonHtmlAttributesAndRest(props);
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(attributes.id), []);

  if (!content.startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  const sizeClass = css({
    "font-size": `var(--${props.size})`,
  });

  return textEditable ? (
    <div className={tx("flex-1 relative hero", classes, sizeClass)}>
      <TextEditor
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={attributes.id}
      />
    </div>
  ) : (
    <div
      ref={ref}
      className={tx("flex-1 hero", classes, sizeClass)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
});

export default Hero;
