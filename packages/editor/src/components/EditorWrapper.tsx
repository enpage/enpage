import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
} from "../hooks/use-editor";
import { useRef, type PropsWithChildren } from "react";
import type { GenericPageConfig, PageBasicInfo } from "@enpage/sdk/shared/page";
import { Theme } from "@enpage/style-system";

import "@radix-ui/themes/styles.css";
import "@enpage/style-system/radix.css";
import "@enpage/style-system/default-theme.css";
import "@enpage/style-system/tiptap-text-editor.css";
import "@enpage/style-system/react-grid-layout.css";
import "@enpage/style-system/react-resizable.css";

export type EditorWrapperProps = {
  enabled?: boolean;
  pageConfig: GenericPageConfig;
  pages: PageBasicInfo[];
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export function EditorWrapper({
  enabled = true,
  pageConfig,
  pages,
  children,
}: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ enabled, pageConfig, pages })).current;
  const draftStore = useRef(
    createDraftStore({
      bricks: pageConfig.bricks,
      attr: pageConfig.attr,
      attrSchema: pageConfig.attributes,
      data: pageConfig.data,
    }),
  ).current;

  return (
    <EditorStoreContext.Provider value={editorStore} key="EditorStoreContext">
      <DraftStoreContext.Provider value={draftStore} key="DraftStoreContext">
        <Theme accentColor="violet" className="w-dvw">
          {children}
        </Theme>
      </DraftStoreContext.Provider>
    </EditorStoreContext.Provider>
  );
}
