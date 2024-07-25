import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import invariant from "tiny-invariant";
import type { ResponsiveMode } from "@enpage/sdk/types";
import type { ElementSelectedPayload } from "@enpage/sdk/browser/dev-client";
export { type Immer } from "immer";

export interface EditorStateProps {
  html?: string;
  previewMode?: ResponsiveMode;
  templateUrl?: string;
  libraryVisible: boolean;
  selectedElement?: ElementSelectedPayload["element"];
}

export interface EditorState extends EditorStateProps {
  setHtml: (html: string) => void;
  setPreviewMode: (mode: ResponsiveMode) => void;
  setSelectedElement: (element?: ElementSelectedPayload["element"]) => void;
  setLibraryVisible: (visible: boolean) => void;
  toggleLibraryVisible: () => void;
}

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS: EditorStateProps = { libraryVisible: false };

  return createStore<EditorState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          setHtml: (html) =>
            set((state) => {
              state.html = html;
            }),
          setSelectedElement: (element) =>
            set((state) => {
              state.selectedElement = element;
            }),

          setLibraryVisible: (visible) =>
            set((state) => {
              state.libraryVisible = visible;
            }),
          toggleLibraryVisible: () =>
            set((state) => {
              state.libraryVisible = !state.libraryVisible;
            }),
          setPreviewMode: (mode) =>
            set((state) => {
              state.previewMode = mode;
            }),
        })),
        {
          name: "editor-state",
          skipHydration: true,
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["blocks", "selectedBlock", "previewMode"].includes(key),
              ),
            ),
        },
      ),
    ),
  );
};

type EditorStore = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStore | null>(null);

export const useEditorStoreContext = () => {
  const store = useContext(EditorStoreContext);
  invariant(store, "useEditorStoreContext must be used within a EditorStoreContext");
  return store;
};

export const useEditor = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx);
};
