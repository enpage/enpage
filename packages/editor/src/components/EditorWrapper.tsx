import Editor, { type EditorProps } from "./Editor";
import { EditorStoreContext, createEditorStore } from "../hooks/use-editor-store";
import { useRef } from "react";

type EditorWrapperProps = EditorProps & {
  html?: string;
  templateUrl?: string;
};
export function EditorWrapper({ html, templateUrl, ...props }: EditorWrapperProps) {
  const store = useRef(
    createEditorStore({
      html,
      templateUrl,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={store}>
      <Editor {...props} />
    </EditorStoreContext.Provider>
  );
}
