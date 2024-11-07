import { useCallback } from "react";
import TextEditor, { createTextEditorUpdateHandler } from "../components/text-editor";
import DOMPurify from "dompurify";

const noop = () => {};

export function useEditableText(brickId: string, initialContext: string, enabled = true) {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  const content = initialContext.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(enabled ? createTextEditorUpdateHandler(brickId) : noop, []);
  return enabled ? (
    <TextEditor initialContent={DOMPurify.sanitize(content)} onUpdate={onUpdateHandler} brickId={brickId} />
  ) : (
    DOMPurify.sanitize(content)
  );
}
