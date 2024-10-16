import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { parse } from "marked";
import DOMPurify from "dompurify";
import { forwardRef, useCallback } from "react";
import { tx } from "@twind/core";
import { getCommonBrickProps, getTextEditableBrickProps } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "hero",
  title: "hero",
  description: "A hero brick",
  icon: "hero",
  file: filename,
  props: Type.Object({
    content: Type.String({
      default: "Click to edit",
      title: "Content",
      description: "The text content",
      "ep:prop-type": "content",
    }),
    justify: Type.Union(
      [
        Type.Literal("text-left", { title: "Left", description: "Left align" }),
        Type.Literal("text-center", { title: "Center", description: "Center align" }),
        Type.Literal("text-right", { title: "Right", description: "Right align" }),
        Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
      ],
      {
        default: "text-left",
        title: "Justify",
        description: "The text alignment",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    ...getTextEditableBrickProps(),
    ...getCommonBrickProps("p-1 hero-5 font-extrabold"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content, className, justify, brickId, textEditable, ...attrs } = props;
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(brickId), []);

  return textEditable ? (
    <div className={tx("flex-1 relative", className, justify)} {...attrs}>
      <TextEditor
        className={className}
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={brickId}
      />
    </div>
  ) : (
    <div
      ref={ref}
      className={tx("flex-1", className, justify)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      {...attrs}
    />
  );
});

export default Text;
