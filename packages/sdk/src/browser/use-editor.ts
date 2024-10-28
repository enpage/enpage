import { createStore, useStore } from "zustand";
import { throttle } from "lodash-es";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "~/shared/responsive";
import invariant from "~/shared/utils/invariant";
import type { Brick, BricksContainer } from "~/shared/bricks";
import type { Theme } from "~/shared/theme";
import { themes } from "~/shared/themes/all-themes";
export { type Immer } from "immer";

export interface EditorStateProps {
  enabled: boolean;
  previewMode?: ResponsiveMode;
  editingPageIndex: number;
  settingsVisible?: boolean;
  selectedBrick?: Brick;
  isEditingTextForBrickId?: string;
  isResizingForContainerId?: string;
  panel?: "library" | "inspector" | "theme";
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: ResponsiveMode) => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettings: () => void;
  setEditingPageIndex: (index: number) => void;
  setSelectedBrick: (brick?: Brick) => void;
  deselectBrick: (brickId?: Brick["id"]) => void;
  setIsEditingText: (forBrickId: string | false) => void;
  setIsResizing: (forContainerid: string | false) => void;
  setPanel: (panel?: EditorStateProps["panel"]) => void;
  togglePanel: (panel: EditorStateProps["panel"]) => void;
}

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS: EditorStateProps = { editingPageIndex: 0, enabled: true };

  return createStore<EditorState>()(
    temporal(
      persist(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          setPreviewMode: (mode) =>
            set((state) => {
              state.previewMode = mode;
            }),
          setSettingsVisible: (visible) =>
            set((state) => {
              state.settingsVisible = visible;
            }),
          toggleSettings: () =>
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
              if (brick) {
                state.panel = "inspector";
              }
            }),
          deselectBrick: (brickId) =>
            set((state) => {
              if (!brickId || _get().selectedBrick?.id === brickId) {
                state.selectedBrick = undefined;
                if (_get().panel === "inspector") {
                  state.panel = undefined;
                }
              }
            }),
          setIsEditingText: (forBrickId: string | false) =>
            set((state) => {
              state.isEditingTextForBrickId = forBrickId || undefined;
            }),
          setIsResizing: (forContainerId: string | false) =>
            set((state) => {
              state.isResizingForContainerId = forContainerId || undefined;
            }),
          setPanel: (panel) =>
            set((state) => {
              state.panel = panel;
            }),
          togglePanel: (panel) =>
            set((state) => {
              state.panel = _get().panel === panel ? undefined : panel;
            }),
        })),
        {
          name: "editor-state",
          skipHydration: true,
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) =>
                  ![
                    "selectedBrick",
                    "panel",
                    "previewMode",
                    "isResizingForContainerId",
                    "isEditingTextForBrickId",
                  ].includes(key),
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
  theme: Theme;
  previewTheme?: Theme;
}

export interface DraftState extends DraftStateProps {
  setContainers: (containers: BricksContainer[]) => void;
  getContainers: () => BricksContainer[];
  getContainer: (id: string) => BricksContainer | undefined;
  updateContainer: (id: string, container: Partial<BricksContainer>) => void;
  deleteContainer: (id: string) => void;
  toggleContainerVisibility: (id: string) => void;
  getBrick: (id: string) => Brick | undefined;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  validatePreviewTheme: () => void;
  cancelPreviewTheme: () => void;
  save(): Promise<void>;
  // setContainerBricks: (id: string, bricks: BricksContainer[]) => void;
}

export const createDraftStore = (initProps: Partial<DraftStateProps>) => {
  const DEFAULT_PROPS: DraftStateProps = { containers: [], theme: themes[1] };
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
              const containerIndex = state.containers.findIndex((item) => item.id === id);
              state.containers[containerIndex] = { ...state.containers[containerIndex], ...container };
              // state.containers = state.containers.map((item) =>
              //   item.id === id ? { ...item, ...container } : item,
              // );
            }),
          updateBrick: (id, brick) =>
            set((state) => {
              // get the container
              const containerIndex = state.containers.findIndex((item) =>
                item.bricks.some((b) => b.id === id),
              );
              state.containers[containerIndex].bricks = state.containers[containerIndex].bricks.map((b) =>
                b.id === id ? { ...b, ...brick } : b,
              );
            }),
          updateBrickProps: (id, props) =>
            set((state) => {
              // get the container
              const containerIndex = state.containers.findIndex((item) =>
                item.bricks.some((b) => b.id === id),
              );
              state.containers[containerIndex].bricks = state.containers[containerIndex].bricks.map((b) =>
                b.id === id ? { ...b, props: { ...b.props, ...props } } : b,
              );
            }),

          getContainers: () => {
            return _get().containers;
          },
          getContainer: (id) => {
            return _get().containers.find((c) => c.id === id);
          },
          save: async () => {
            //todo: call API
          },
          getBrick: (id) => {
            return _get()
              .containers.flatMap((c) => c.bricks)
              .find((b) => b.id === id);
          },
          setPreviewTheme: (theme) =>
            set((state) => {
              state.previewTheme = theme;
            }),
          validatePreviewTheme: () =>
            set((state) => {
              if (state.previewTheme) {
                state.theme = state.previewTheme;
              }
              state.previewTheme = undefined;
            }),
          cancelPreviewTheme: () =>
            set((state) => {
              state.previewTheme = undefined;
            }),
          setTheme: (theme) =>
            set((state) => {
              state.theme = theme;
            }),
        })),
        {
          name: "draft-state",
          skipHydration: true,
        },
      ),
      {
        handleSet: (handleSet) =>
          throttle<typeof handleSet>((state) => {
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
  if (!store) {
    console.log("Problem with EditorStoreContext", store);
  }
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
