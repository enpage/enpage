import { EditorStoreContext, DraftStoreContext, createDraftStore, createEditorStore } from "./use-editor";
import { useRef, type PropsWithChildren } from "react";
import type { GenericPageConfig } from "~/shared/page-config";
import { Theme } from "@radix-ui/themes";
import Page from "./page";

import "@enpage/style-system/default-theme.css";
import "@enpage/style-system/tiptap-text-editor.css";
import "@enpage/style-system/radix.css";
import "@enpage/style-system/react-grid-layout.css";
import "@enpage/style-system/react-resizable.css";

type EditorWrapperProps = {
  enabled?: boolean;
  config: GenericPageConfig;
};

export function EditorWrapper({ enabled = true, config, children }: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ enabled })).current;
  const draftStore = useRef(
    createDraftStore({
      bricks: config.bricks,
      attr: config.attr,
      attrSchema: config.attributes,
      data: config.data,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={editorStore} key="EditorStoreContext">
      <DraftStoreContext.Provider value={draftStore} key="DraftStoreContext">
        <Theme accentColor="violet">{children ?? <Page />}</Theme>
      </DraftStoreContext.Provider>
    </EditorStoreContext.Provider>
  );
}
