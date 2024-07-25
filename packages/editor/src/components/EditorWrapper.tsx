"use client";
import Editor from "./Editor";
import { EditorStoreContext, createEditorStore } from "../hooks/use-editor-store";
import { useRef } from "react";

type EditorWrapperProps = {
  html?: string;
};
export function EditorWrapper(props: EditorWrapperProps) {
  const store = useRef(
    createEditorStore({
      html: props.html,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={store}>
      <Editor />
    </EditorStoreContext.Provider>
  );
}
