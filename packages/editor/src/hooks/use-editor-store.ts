import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import invariant from "@enpage/sdk/utils/invariant";
import type { ResponsiveMode } from "@enpage/sdk/responsive";
import type { ElementSelectedPayload } from "@enpage/sdk/browser/types";
export { type Immer } from "immer";

export interface EditorStateProps {
  previewMode?: ResponsiveMode;
  templateUrl?: string;
  libraryVisible: boolean;
  editingPageIndex: number;
  settingsVisible?: boolean;
  selectedElement?: ElementSelectedPayload["element"];
}

export interface DraftStateProps {
  html: string;
  body: string;
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: ResponsiveMode) => void;
  setSelectedElement: (element?: ElementSelectedPayload["element"]) => void;
  setLibraryVisible: (visible: boolean) => void;
  toggleLibraryVisible: () => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettingsVisible: () => void;
  setEditingPageIndex: (index: number) => void;
}

export interface DraftState extends DraftStateProps {
  setBody: (body: string) => void;
}

export const createDraftStore = (initProps: Partial<DraftStateProps>) => {
  const DEFAULT_PROPS: DraftStateProps = { html: "", body: "" };
  return createStore<DraftState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          setBody: (body) =>
            set((state) => {
              state.body = body;
            }),
        })),
        {
          name: "draft-state",
          skipHydration: true,
        },
      ),
    ),
  );
};

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS: EditorStateProps = { libraryVisible: false, editingPageIndex: 0 };

  return createStore<EditorState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
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
          setSettingsVisible: (visible) =>
            set((state) => {
              state.settingsVisible = visible;
            }),
          toggleSettingsVisible: () =>
            set((state) => {
              state.settingsVisible = !state.settingsVisible;
            }),
          setEditingPageIndex: (index) =>
            set((state) => {
              state.editingPageIndex = index;
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
type DraftStore = ReturnType<typeof createDraftStore>;

export const EditorStoreContext = createContext<EditorStore | null>(null);
export const DraftStoreContext = createContext<DraftStore | null>(null);

export const useEditorStoreContext = () => {
  const store = useContext(EditorStoreContext);
  invariant(store, "useEditorStoreContext must be used within a EditorStoreContext");
  return store;
};

export const useDraftStoreContext = () => {
  const store = useContext(DraftStoreContext);
  invariant(store, "useDraftStoreContext must be used within a DraftStoreContext");
  return store;
};

export const useDraftUndoManager = () => {
  const ctx = useDraftStoreContext();
  return ctx.temporal.getState();
};

export const useEditor = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};
