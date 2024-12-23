import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
} from "../hooks/use-editor";
import { useEffect, useRef, type PropsWithChildren } from "react";
import type { GenericPageConfig } from "@upstart.gg/sdk/shared/page";
import { Theme } from "@upstart.gg/style-system/system";
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
  onReady?: () => void;
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export function EditorWrapper({
  enabled = true,
  pageConfig,
  mode,
  children,
  onReady = () => {},
}: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ enabled, pageConfig, mode })).current;
  const draftStore = useRef(
    createDraftStore({
      bricks: pageConfig.bricks,
      attr: pageConfig.attr,
      attrSchema: pageConfig.attributes,
      data: pageConfig.data,
    }),
  ).current;

  const { isDarkMode } = useDarkMode({ initializeWithValue: false });

  useEffect(onReady, []);

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
