import type { BricksContainer } from "~/shared/bricks";
import { EditorStoreContext, DraftStoreContext, createDraftStore, createEditorStore } from "../use-editor";
import { useRef, type PropsWithChildren } from "react";

type EditorWrapperProps = {
  enabled: boolean;
  initialBricks: BricksContainer[];
};

export function EditorWrapper({ enabled, initialBricks, children }: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ enabled })).current;
  const draftStore = useRef(
    createDraftStore({
      containers: initialBricks,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={editorStore} key="EditorStoreContext">
      <DraftStoreContext.Provider value={draftStore} key="DraftStoreContext">
        {children}
      </DraftStoreContext.Provider>
    </EditorStoreContext.Provider>
  );
}
