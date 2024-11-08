import { createStore, useStore } from "zustand";
import { debounce } from "lodash-es";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "@enpage/sdk/shared/responsive";
import invariant from "@enpage/sdk/shared/utils/invariant";
import type { Brick, BrickPosition } from "@enpage/sdk/shared/bricks";
import type { Theme } from "@enpage/sdk/shared/theme";
import { themes } from "@enpage/sdk/shared/themes/all-themes";
import type { AttributesResolved } from "@enpage/sdk/shared/attributes";
import { generateId, type BrickManifest } from "@enpage/sdk/shared/bricks";
import type { TObject } from "@sinclair/typebox";
import type { GenericPageConfig, PageBasicInfo } from "@enpage/sdk/shared/page";
export { type Immer } from "immer";
import type { Static } from "@sinclair/typebox";

export interface EditorStateProps {
  enabled: boolean;
  pageConfig: GenericPageConfig;
  pages: PageBasicInfo[];
  /**
   * The brick manifest that is being dragged from the library
   */
  draggingBrick?: Static<BrickManifest>;
  previewMode: ResponsiveMode;
  editingPageIndex: number;
  settingsVisible?: boolean;
  selectedBrick?: Brick;
  selectedGroup?: Brick["id"][];
  isEditingTextForBrickId?: string;
  isResizingForContainerId?: string;
  panel?: "library" | "inspector" | "theme" | "settings";
}

export interface EditorState extends EditorStateProps {
  setDraggingBrick: (draggingBrick?: EditorStateProps["draggingBrick"]) => void;
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
  hidePanel: (panel: EditorStateProps["panel"]) => void;
  setSelectedGroup: (group: Brick["id"][]) => void;
}

export const createEditorStore = (
  initProps: Partial<EditorStateProps> & { pageConfig: GenericPageConfig; pages: PageBasicInfo[] },
) => {
  const DEFAULT_PROPS: Omit<EditorStateProps, "pageConfig" | "pages"> = {
    editingPageIndex: 0,
    enabled: true,
    previewMode: "desktop",
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
                if (state.selectedBrick && (!brickId || state.selectedBrick?.id === brickId)) {
                  console.log("updated selected brick to nothing");
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
        // limit undo history to 100
        { limit: 100 },
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
}

export interface DraftState extends DraftStateProps {
  getBricks: () => Brick[];
  getBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  duplicateBrick: (id: string) => void;
  addBrick: (brick: Brick) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>) => void;
  updateBrickPosition: (id: string, bp: keyof Brick["position"], position: BrickPosition) => void;
  updateBricksPositions: (bp: keyof Brick["position"], positions: Record<string, BrickPosition>) => void;
  toggleBrickVisibilityPerBreakpoint: (id: string, breakpoint: keyof Brick["position"]) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  validatePreviewTheme: () => void;
  cancelPreviewTheme: () => void;
  updateAttributes: (attr: AttributesResolved) => void;
  save(): Promise<void>;
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
  },
) => {
  const DEFAULT_PROPS: Omit<DraftStateProps, "attr" | "attrSchema"> = {
    bricks: [],
    theme: themes[1],
    data: {},
  };
  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,
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

            getBricks: () => _get().bricks,

            save: async () => {
              //todo: call API
            },
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
                state.bricks[brickIndex].position[bp] = position;
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
          })),
          {
            name: "draft-state",
            skipHydration: true,
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(([key]) => !["attrSchema", "attr"].includes(key)),
              ),
          },
        ),
        {
          // limit undo history to 100
          limit: 100,
          // handleSet: (handleSet) =>
          //   throttle<typeof handleSet>((state) => {
          //     handleSet(state);
          //   }, 200),
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
  return useStore(ctx, (state) => state.pages);
};

export const usePreviewMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.previewMode);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};

export const useBricks = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.bricks);
};

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

export const useBricksSubscribe = (callback: (bricks: DraftState["bricks"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.bricks, debounce(callback, 200));
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
  const { mobile, tablet, desktop } = brick.position;
  return {
    mobile: { ...(mobile ?? tablet ?? desktop)!, y: (mobile ?? tablet ?? desktop)!.y + 1 },
    tablet: { ...(tablet ?? desktop ?? mobile)!, y: (tablet ?? desktop ?? mobile)!.y + 1 },
    desktop: {
      ...(desktop ?? tablet ?? mobile)!,
      y: (desktop ?? tablet ?? mobile)!.y + 1,
      x: (desktop ?? tablet ?? mobile)!.x + 1,
    },
  };
}
