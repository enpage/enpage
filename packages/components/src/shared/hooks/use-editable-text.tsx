import { useCallback, lazy, Suspense } from "react";
import type { EditorEvents } from "@tiptap/react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraft } from "~/editor/hooks/use-editor";
import type { TextEditorProps } from "../components/TextEditor";

const TextEditorAsync = lazy(() => import("../components/TextEditor"));

export function useEditableText({
  brickId,
  initialContent,
  ...props
}: Pick<TextEditorProps, "brickId" | "initialContent" | "menuPlacement" | "inline" | "enabled">) {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  const content = initialContent.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(brickId), []);
  return (
    <Suspense fallback={null}>
      <TextEditorAsync initialContent={content} onUpdate={onUpdateHandler} brickId={brickId} {...props} />
    </Suspense>
  );
}

function createTextEditorUpdateHandler(brickId: Brick["id"], prop = "content") {
  const draft = useDraft();
  return (e: EditorEvents["update"]) => {
    console.log("text editor update for brick %s", brickId, e.editor.getHTML());
    const brick = draft.getBrick(brickId);
    if (!brick) {
      console.warn("No brick for update found for id", brickId);
      return;
    }
    draft.updateBrick(brickId, {
      props: {
        ...(brick?.props ?? {}),
        [prop]: e.editor.getHTML(),
      },
    });
  };
}
