import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import DOMPurify from "dompurify";
import { forwardRef, memo, useCallback, useState } from "react";
import { tx } from "../twind";
import { commonBrickProps, editableTextProps, getHtmlAttributesAndRest } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";
import { isEqualWith, isEqual } from "lodash-es";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text",
  title: "Text",
  description: "A textual brick",
  icon: "text",
  file: filename,
  props: Type.Composite([editableTextProps, commonBrickProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let {
    attributes,
    classes,
    rest: { textEditable, content },
  } = getHtmlAttributesAndRest(props);

  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(attributes.id), []);

  return textEditable ? (
    <div className={tx("flex-1", classes)}>
      <TextEditor
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={attributes.id}
      />
    </div>
  ) : (
    <div className={tx("flex-1", classes)}>{DOMPurify.sanitize(content)}</div>
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
