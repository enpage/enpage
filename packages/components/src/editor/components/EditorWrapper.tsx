import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
} from "../hooks/use-editor";
import { useRef, type PropsWithChildren } from "react";
import type { GenericPageConfig, PageBasicInfo } from "@upstart.gg/sdk/shared/page";
import { Theme } from "@upstart.gg/style-system";
import { tx } from "@upstart.gg/style-system/twind";
import { useDarkMode } from "usehooks-ts";

import "@radix-ui/themes/styles.css";
import "@upstart.gg/style-system/radix.css";
import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/style-system/tiptap-text-editor.css";
import "@upstart.gg/style-system/react-resizable.css";

export type EditorWrapperProps = {
  mode?: "local" | "remote";
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
  mode,
  children,
}: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ enabled, pageConfig, pages, mode })).current;
  const draftStore = useRef(
    createDraftStore({
      bricks: pageConfig.bricks,
      attr: pageConfig.attr,
      attrSchema: pageConfig.attributes,
      data: pageConfig.data,
    }),
  ).current;

  const { isDarkMode } = useDarkMode();

  return (
    <EditorStoreContext.Provider value={editorStore} key="EditorStoreContext">
      <DraftStoreContext.Provider value={draftStore} key="DraftStoreContext">
        <Theme accentColor="violet" className={tx("w-[100dvw]")} appearance={isDarkMode ? "dark" : "light"}>
          {children}
        </Theme>
      </DraftStoreContext.Provider>
    </EditorStoreContext.Provider>
  );
}
