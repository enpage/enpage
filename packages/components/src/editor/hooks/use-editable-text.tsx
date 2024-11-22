import { useCallback, lazy, Suspense } from "react";
import DOMPurify from "dompurify";
import { useDraft } from "~/editor/hooks/use-editor";
import type { Brick } from "@enpage/sdk/shared/bricks";
import type { EditorEvents } from "@tiptap/react";

const TextEditorAsync = lazy(() => import("../components/TextEditor"));

const noop = () => {};

export function useEditableText(brickId: string, initialContext: string, enabled = true) {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  const content = initialContext.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(enabled ? createTextEditorUpdateHandler(brickId) : noop, []);
  return enabled ? (
    <Suspense fallback={null}>
      <TextEditorAsync
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={brickId}
      />
    </Suspense>
  ) : (
    DOMPurify.sanitize(content)
  );
}

function createTextEditorUpdateHandler(brickId: Brick["id"], prop = "content") {
  const draft = useDraft();
  return (e: EditorEvents["update"]) => {
    const brick = draft.getBrick(brickId);
    if (!brick) {
      console.warn("No brick for update found for id", brickId);
      return;
    }
    console.log("text editor update for brick %s", brickId);
    draft.updateBrick(brickId, {
      props: {
        ...(brick?.props ?? {}),
        [prop]: e.editor.getHTML(),
      },
    });
  };
}
