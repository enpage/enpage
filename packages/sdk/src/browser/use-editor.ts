import { createStore, useStore } from "zustand";
import { throttle } from "lodash-es";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "~/shared/responsive";
import invariant from "~/shared/utils/invariant";
import type { Brick, BricksContainer } from "~/shared/bricks";
export { type Immer } from "immer";

export interface EditorStateProps {
  enabled: boolean;
  previewMode?: ResponsiveMode;
  templateUrl?: string;
  libraryVisible: boolean;
  editingPageIndex: number;
  settingsVisible?: boolean;
  selectedBrick?: Brick;
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: ResponsiveMode) => void;
  setLibraryVisible: (visible: boolean) => void;
  toggleLibraryVisible: () => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettingsVisible: () => void;
  setEditingPageIndex: (index: number) => void;
  setSelectedBrick: (brick: Brick) => void;
}

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS: EditorStateProps = { libraryVisible: false, editingPageIndex: 0, enabled: true };

  return createStore<EditorState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
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
          setSelectedBrick: (brick) =>
            set((state) => {
              state.selectedBrick = brick;
            }),
        })),
        {
          name: "editor-state",
          skipHydration: true,
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["selectedBrick", "libraryVisible", "previewMode"].includes(key),
              ),
            ),
        },
      ),
    ),
  );
};

type EditorStore = ReturnType<typeof createEditorStore>;

export interface DraftStateProps {
  containers: BricksContainer[];
}

export interface DraftState extends DraftStateProps {
  setContainers: (containers: BricksContainer[]) => void;
  toggleContainerVisibility: (id: string) => void;
  deleteContainer: (id: string) => void;
  updateContainer: (id: string, container: Partial<BricksContainer>) => void;
  save(): Promise<void>;
  // setContainerBricks: (id: string, bricks: BricksContainer[]) => void;
}

export const createDraftStore = (initProps: Partial<DraftStateProps>) => {
  const DEFAULT_PROPS: DraftStateProps = { containers: [] };
  return createStore<DraftState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          setContainers: (bricks) =>
            set((state) => {
              state.containers = bricks;
            }),
          toggleContainerVisibility: (id) =>
            set((state) => {
              state.containers = state.containers.map((item) =>
                item.id === id ? { ...item, hidden: !item.hidden } : item,
              );
            }),
          deleteContainer: (id) =>
            set((state) => {
              state.containers = state.containers.filter((item) => item.id !== id);
            }),
          updateContainer: (id, container) =>
            set((state) => {
              state.containers = state.containers.map((item) =>
                item.id === id ? { ...item, ...container } : item,
              );
            }),
          save: async () => {
            console.log("saving");
          },
        })),
        {
          name: "draft-state",
          skipHydration: true,
        },
      ),
      {
        handleSet: (handleSet) =>
          throttle<typeof handleSet>((state) => {
            console.info("handleSet called");
            handleSet(state);
          }, 200),
      },
    ),
  );
};

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

export const useEditorEnabled = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.enabled);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};
