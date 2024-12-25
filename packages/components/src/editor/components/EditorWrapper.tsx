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
  pageConfig: GenericPageConfig;
  onReady?: () => void;
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export function EditorWrapper({
  pageConfig,
  mode,
  children,
  onReady = () => {},
}: PropsWithChildren<EditorWrapperProps>) {
  const editorStore = useRef(createEditorStore({ mode })).current;
  const draftStore = useRef(
    createDraftStore({
      siteId: pageConfig.siteId,
      hostname: pageConfig.hostname,
      pagesMap: pageConfig.pagesMap,
      siteAttributes: pageConfig.siteAttributes,
      siteLabel: pageConfig.siteLabel,
      id: pageConfig.id,
      path: pageConfig.path,
      label: pageConfig.label,
      bricks: pageConfig.bricks,
      attr: pageConfig.attr,
      attributes: pageConfig.attributes,
      data: pageConfig.data,
      theme: pageConfig.theme,
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
