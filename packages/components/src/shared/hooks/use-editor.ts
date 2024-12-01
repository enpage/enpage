import { createStore, useStore } from "zustand";
import { debounce } from "lodash-es";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "~/shared/responsive";
import invariant from "~/shared/utils/invariant";
import type { Brick, BrickPosition } from "~/shared/bricks";
import type { Theme } from "~/shared/theme";
import type { AttributesResolved } from "~/shared/attributes";
import { generateId } from "~/shared/bricks";
import type { TObject } from "@sinclair/typebox";
import type { GenericPageConfig } from "~/shared/page";
export { type Immer } from "immer";
import type { Static } from "@sinclair/typebox";
import type { ColorAdjustment } from "~/shared/themes/color-system";
import { adjustMobileLayout } from "~/shared/utils/layout-utils";
import { isEqual } from "lodash-es";
import type { BrickManifest } from "../brick-manifest";

export interface EditorStateProps {
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
  enabled: boolean;
  pageConfig: GenericPageConfig;

  /**
   * The brick manifest that is being dragged from the library
   */
  draggingBrick?: Static<BrickManifest>;
  previewMode: ResponsiveMode;
  settingsVisible?: boolean;
  selectedBrick?: Brick;
  selectedGroup?: Brick["id"][];
  isEditingTextForBrickId?: string;
  shouldShowGrid?: boolean;
  panel?: "library" | "inspector" | "theme" | "settings";
  modal?: "image-search" | "datasources";
  panelPosition: "left" | "right";
  /**
   * Latest used color adjustment
   */
  colorAdjustment: ColorAdjustment;
}

export interface EditorState extends EditorStateProps {
  setDraggingBrick: (draggingBrick?: EditorStateProps["draggingBrick"]) => void;
  setPreviewMode: (mode: ResponsiveMode) => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettings: () => void;
  setSelectedBrick: (brick?: Brick) => void;
  deselectBrick: (brickId?: Brick["id"]) => void;
  setIsEditingText: (forBrickId: string | false) => void;
  setPanel: (panel?: EditorStateProps["panel"]) => void;
  togglePanel: (panel: EditorStateProps["panel"]) => void;
  hidePanel: (panel: EditorStateProps["panel"]) => void;
  setSelectedGroup: (group?: Brick["id"][]) => void;
  setShouldShowGrid: (show: boolean) => void;
  setColorAdjustment: (colorAdjustment: ColorAdjustment) => void;
  togglePanelPosition: () => void;
  showModal: (modal: EditorStateProps["modal"]) => void;
  hideModal: () => void;
}

export const createEditorStore = (
  initProps: Partial<EditorStateProps> & { pageConfig: GenericPageConfig },
) => {
  const DEFAULT_PROPS: Omit<EditorStateProps, "pageConfig" | "pages"> = {
    enabled: true,
    previewMode: "desktop",
    mode: "local",
    colorAdjustment: "default",
    panelPosition: "left",
  };

  return createStore<EditorState>()(
    subscribeWithSelector(
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

            setSelectedBrick: (brick) =>
              set((state) => {
                state.selectedBrick = brick;
                if (brick) {
                  state.panel = "inspector";
                }
              }),

            deselectBrick: (brickId) =>
              set((state) => {
                if (state.selectedBrick && (!brickId || state.selectedBrick?.id === brickId)) {
                  state.selectedBrick = undefined;
                  if (state.panel === "inspector") {
                    state.panel = undefined;
                  }
                }
              }),

            setIsEditingText: (forBrickId: string | false) =>
              set((state) => {
                state.isEditingTextForBrickId = forBrickId || undefined;
              }),

            setPanel: (panel) =>
              set((state) => {
                state.panel = panel;
              }),

            togglePanel: (panel) =>
              set((state) => {
                state.panel = state.panel === panel ? undefined : panel;
              }),

            hidePanel: (panel) =>
              set((state) => {
                if (state.panel === panel) {
                  state.panel = undefined;
                }
              }),

            setDraggingBrick: (draggingBrick) =>
              set((state) => {
                state.draggingBrick = draggingBrick;
              }),

            setSelectedGroup: (group) =>
              set((state) => {
                state.selectedGroup = group;
              }),

            setShouldShowGrid: (show) =>
              set((state) => {
                state.shouldShowGrid = show;
              }),

            setColorAdjustment: (colorAdjustment) =>
              set((state) => {
                state.colorAdjustment = colorAdjustment;
              }),

            togglePanelPosition: () =>
              set((state) => {
                state.panelPosition = state.panelPosition === "left" ? "right" : "left";
              }),

            showModal: (modal) =>
              set((state) => {
                state.modal = modal;
              }),

            hideModal: () =>
              set((state) => {
                state.modal = undefined;
              }),
          })),
          {
            name: `editor-state-${initProps.pageConfig.id}`,
            skipHydration: initProps.mode === "remote",
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(
                  ([key]) =>
                    ![
                      "enabled",
                      "mode",
                      "selectedBrick",
                      "panel",
                      "isEditingTextForBrickId",
                      "draggingBrick",
                      "shouldShowGrid",
                    ].includes(key),
                ),
              ),
          },
        ),
        // limit undo history to 100
        { limit: 100, equality: (pastState, currentState) => isEqual(pastState, currentState) },
      ),
    ),
  );
};

type EditorStore = ReturnType<typeof createEditorStore>;

export interface DraftStateProps {
  bricks: Brick[];
  data: Record<string, unknown>;
  attr: AttributesResolved;
  attrSchema: TObject;
  theme: Theme;
  previewTheme?: Theme;
  version?: string;
  lastSaved?: Date;
  dirty?: boolean;
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
}

export interface DraftState extends DraftStateProps {
  setBricks: (bricks: Brick[]) => void;
  getBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  duplicateBrick: (id: string) => void;
  addBrick: (brick: Brick) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>) => void;
  updateBrickPosition: (id: string, bp: keyof Brick["position"], position: Partial<BrickPosition>) => void;
  updateBricksPositions: (bp: keyof Brick["position"], positions: Record<string, BrickPosition>) => void;
  toggleBrickVisibilityPerBreakpoint: (id: string, breakpoint: keyof Brick["position"]) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  validatePreviewTheme: () => void;
  cancelPreviewTheme: () => void;
  updateAttributes: (attr: AttributesResolved) => void;
  setLastSaved: (date: Date) => void;
  setDirty: (dirty: boolean) => void;
  setVersion(version: string): void;
  adjustMobileLayout(): void;
  // setContainerBricks: (id: string, bricks: BricksContainer[]) => void;
}

/**
 * Create a draft store with initial props
 *
 * Note: `data` is optional but `attr` is always provided
 */
export const createDraftStore = (
  initProps: Partial<DraftStateProps> & {
    attr: DraftStateProps["attr"];
    attrSchema: DraftStateProps["attrSchema"];
    theme: DraftStateProps["theme"];
  },
) => {
  const DEFAULT_PROPS: Omit<DraftStateProps, "attr" | "attrSchema" | "theme"> = {
    bricks: [],
    data: {},
    mode: "local",
  };

  console.log("Creating draft store with", initProps);

  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,

            setBricks: (bricks) =>
              set((state) => {
                state.bricks = bricks;
              }),

            deleteBrick: (id) =>
              set((state) => {
                const brickIndex = state.bricks.findIndex((item) => item.id === id);
                state.bricks.splice(brickIndex, 1);
              }),

            duplicateBrick: (id) =>
              set((state) => {
                const brick = state.bricks.find((item) => item.id === id);
                if (brick) {
                  const newBrick = {
                    ...brick,
                    id: `brick-${generateId()}`,
                    position: getDuplicatedBrickPosition(brick),
                  };
                  state.bricks.push(newBrick);
                }
              }),

            updateBrick: (id, brick) =>
              set((state) => {
                const brickIndex = state.bricks.findIndex((item) => item.id === id);
                state.bricks[brickIndex] = { ...state.bricks[brickIndex], ...brick };
              }),

            updateBrickProps: (id, props) =>
              set((state) => {
                const brickIndex = _get().bricks.findIndex((item) => item.id === id);
                state.bricks[brickIndex].props = { ...state.bricks[brickIndex].props, ...props };
              }),

            getBrick: (id) => {
              return _get().bricks.find((b) => b.id === id);
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

            updateBricksPositions: (bp, positions) =>
              set((state) => {
                state.bricks.forEach((b) => {
                  if (positions[b.id]) {
                    b.position[bp] = positions[b.id];
                  }
                });
              }),

            updateBrickPosition: (id, bp, position) =>
              set((state) => {
                const brickIndex = state.bricks.findIndex((item) => item.id === id);
                Object.assign(state.bricks[brickIndex].position[bp], position);
              }),

            toggleBrickVisibilityPerBreakpoint: (id, breakpoint) =>
              set((state) => {
                const brickIndex = state.bricks.findIndex((item) => item.id === id);
                state.bricks[brickIndex].position[breakpoint]!.hidden =
                  !state.bricks[brickIndex].position[breakpoint]?.hidden;
              }),

            addBrick: (brick) =>
              set((state) => {
                console.log("Adding brick", brick);
                state.bricks.push(brick);
              }),

            updateAttributes: (attr) =>
              set((state) => {
                state.attr = attr;
              }),

            setVersion: (version) =>
              set((state) => {
                state.version = version;
              }),

            adjustMobileLayout: () =>
              set((state) => {
                state.bricks = adjustMobileLayout(state.bricks);
              }),

            setLastSaved: (date) =>
              set((state) => {
                state.lastSaved = date;
              }),

            setDirty: (dirty) =>
              set((state) => {
                state.dirty = dirty;
              }),
          })),
          {
            name: "draft-state",
            skipHydration: initProps.mode === "remote",
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(
                  ([key]) => !["previewTheme", "attrSchema", "lastSaved"].includes(key),
                ),
              ),
          },
        ),
        {
          // limit undo history to 100
          limit: 100,
          equality: (pastState, currentState) => isEqual(pastState, currentState),
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["previewTheme", "attrSchema", "lastSaved"].includes(key),
              ),
            ) as DraftState,
          handleSet: (handleSet) =>
            debounce<typeof handleSet>((state) => {
              if (state) {
                handleSet(state);
              }
            }, 200),
        },
      ),
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

export const usePagesInfo = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.pageConfig.pagesMap);
};

export const usePreviewMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.previewMode);
};

export const useSelectedGroup = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedGroup);
};

export const useColorAdjustment = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.colorAdjustment);
};

export const useEditorMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.mode);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};

// export const useBricks = () => {
//   const ctx = useDraftStoreContext();
//   return useStore(ctx, (state) => state.bricks);
// };

export const useGetBrick = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.getBrick);
};

export function usePageVersion() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.version);
}

export function useLastSaved() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.lastSaved);
}

export const useAttributes = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.attr);
};

export const useAttributesSchema = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.attrSchema);
};

export const usePageConfig = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.pageConfig);
};

export const useTheme = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.theme);
};

export const useBricksSubscribe = (callback: (bricks: DraftState["bricks"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.bricks, debounce(callback, 200), { fireImmediately: false });
  }, []);
};

export const useAttributesSubscribe = (callback: (attr: DraftState["attr"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.attr, callback);
  }, []);
};

export const useThemeSubscribe = (callback: (theme: DraftState["theme"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.theme, callback);
  }, []);
};

export const usePagePathSubscribe = (callback: (path: EditorState["pageConfig"]["path"]) => void) => {
  const ctx = useEditorStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.pageConfig.path, callback);
  }, []);
};

/**
 * Return the original position of the duplicated brick translated to the new position (+1 row for each breakpoint)
 */
function getDuplicatedBrickPosition(brick: Brick) {
  const { mobile, desktop } = brick.position;
  return {
    mobile: { ...(mobile ?? desktop)!, y: (mobile ?? desktop)!.y + 1 },
    desktop: {
      ...(desktop ?? mobile)!,
      y: (desktop ?? mobile)!.y + 1,
      x: (desktop ?? mobile)!.x + 1,
    },
  };
}
