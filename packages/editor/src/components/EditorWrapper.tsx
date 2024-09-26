import Editor, { type EditorProps } from "./Editor";
import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
} from "../hooks/use-editor-store";
import { useRef } from "react";

type EditorWrapperProps = EditorProps & {
  html: string;
  body: string;
  templateUrl: string;
};

export function EditorWrapper({ html, body, templateUrl, ...props }: EditorWrapperProps) {
  const editorStore = useRef(
    createEditorStore({
      templateUrl,
    }),
  ).current;

  const draftStore = useRef(
    createDraftStore({
      body,
      html,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={editorStore}>
      <DraftStoreContext.Provider value={draftStore}>
        <Editor {...props} />
      </DraftStoreContext.Provider>
    </EditorStoreContext.Provider>
  );
}
