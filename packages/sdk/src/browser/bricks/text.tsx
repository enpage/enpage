import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import DOMPurify from "dompurify";
import { forwardRef, memo, useCallback, useState } from "react";
import { tx } from "@twind/core";
import { getCommonBrickProps, getTextEditableBrickProps } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";
import type { Brick } from "~/shared/bricks";
import { isEqualWith, isEqual } from "lodash-es";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text",
  title: "Text",
  description: "A textual brick",
  icon: "text",
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
    ...getCommonBrickProps("p-1"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content, className, justify, textEditable, brickId, ...attrs } = props;
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(brickId), []);

  return textEditable ? (
    <div className={tx("flex-1", className)}>
      <TextEditor initialContent={DOMPurify.sanitize(content)} onUpdate={onUpdateHandler} brickId={brickId} />
    </div>
  ) : (
    <div className={tx("flex-1", className)}>{DOMPurify.sanitize(content)}</div>
  );
});

export default memo(Text, (prevProps, nextProps) => {
  // !WARN: keep unused args because lodash do not pass the "key" when following args are not present
  const compared = isEqualWith(prevProps, nextProps, (objValue, othValue, key, _, __) => {
    if (key === "content") {
      // If the key is in our ignore list, consider it equal
      return true;
    }
    // Otherwise, use the default comparison
    return undefined;
  });
  return compared;
});
