// @ts-nocheck
import { createStore, useStore } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "@enpage/sdk/shared/responsive";
import type { Brick, BrickPosition, BricksLayout, Breakpoint } from "@enpage/sdk/shared/bricks";
import type { AttributesResolved } from "@enpage/sdk/shared/attributes";
import type { GenericPageConfig, PageBasicInfo } from "@enpage/sdk/shared/page";
export { type Immer } from "immer";
import type { Static } from "@sinclair/typebox";

interface GridConfig {
  cols: {
    mobile: number;
    desktop: number;
  };
  gutterWidth: number;
  gutterHeight: number;
  containerWidth: number; // Total grid width
  baseRowHeight: number;
}

type GridBrick = Brick & {
  selected?: boolean;
};

export interface Size {
  w: number;
  h: number;
}

export interface GridStateProps {
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   */
  bricks: GridBrick[];
  gridConfig: GridConfig;
  currentBreakpoint: Breakpoint;
  selectedIds: Set<string>;
  dragStartPositions: Map<string, Brick["position"]>;
}

export interface GridState extends GridStateProps {
  // Breakpoint actions
  setBreakpoint: (breakpoint: Breakpoint) => void;

  // Selection actions
  selectBricks: (ids: string[]) => void;
  deselectAll: () => void;
  toggleSelection: (id: string) => void;

  // Group drag actions
  startGroupDrag: () => void;
  updateGroupDrag: (dragOffset: BrickPosition) => void;
  commitGroupDrag: () => void;

  // Single brick actions
  addBrick: (brick: Omit<Brick, "position"> & { position: BrickPosition }) => void;
  removeBrick: (id: string) => void;
  updateBrickPosition: (id: string, position: BrickPosition) => void;
  updateBrickSize: (id: string, size: Size) => void;

  // Grid utilities
  getPixelPosition: (gridPosition: BrickPosition) => { x: number; y: number };
  getGridPosition: (pixelPosition: { x: number; y: number }) => { x: number; y: number };
  getPixelSize: (gridSize: Size) => { width: number; height: number };
  snapToGrid: (pixelPosition: { x: number; y: number }) => { x: number; y: number };

  getCellWidth: () => number;
  getCellHeight: () => number;
}

export const createGridStore = (initProps: Partial<GridStateProps>) => {
  const DEFAULT_PROPS = {
    bricks: [],
    gridConfig: {
      cols: {
        desktop: 12,
        mobile: 4,
      },
      gutterWidth: 10,
      gutterHeight: 10,
      containerWidth: 1200, // Default width
      baseRowHeight: 60, // Default row height
    },
    currentBreakpoint: "desktop" as Breakpoint,
    selectedIds: new Set<string>(),
    dragStartPositions: new Map(),
  };

  return createStore<GridState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, get) => ({
            ...DEFAULT_PROPS,
            ...initProps,

            getCellWidth: () => {
              const { containerWidth, gutterWidth, cols } = get().gridConfig;
              const currentCols = cols[get().currentBreakpoint];
              const totalGutters = currentCols - 1;
              const totalGutterWidth = totalGutters * gutterWidth;
              return (containerWidth - totalGutterWidth) / currentCols;
            },

            getCellHeight: () => {
              return get().gridConfig.baseRowHeight;
            },

            getPixelPosition: (gridPosition) => {
              const { gutterWidth, gutterHeight } = get().gridConfig;
              const cellWidth = get().getCellWidth();
              const cellHeight = get().getCellHeight();

              return {
                x: gridPosition.x * (cellWidth + gutterWidth),
                y: gridPosition.y * (cellHeight + gutterHeight),
              };
            },

            getGridPosition: (pixelPosition) => {
              const { gutterWidth, gutterHeight } = get().gridConfig;
              const cellWidth = get().getCellWidth();
              const cellHeight = get().getCellHeight();

              return {
                x: Math.round(pixelPosition.x / (cellWidth + gutterWidth)),
                y: Math.round(pixelPosition.y / (cellHeight + gutterHeight)),
              };
            },

            getPixelSize: (gridSize) => {
              const { gutterWidth, gutterHeight } = get().gridConfig;
              const cellWidth = get().getCellWidth();
              const cellHeight = get().getCellHeight();

              return {
                width: gridSize.w * cellWidth + (gridSize.w - 1) * gutterWidth,
                height: gridSize.h * cellHeight + (gridSize.h - 1) * gutterHeight,
              };
            },

            snapToGrid: (pixelPosition) => {
              const { gutterWidth, gutterHeight } = get().gridConfig;
              const cellWidth = get().getCellWidth();
              const cellHeight = get().getCellHeight();

              const unitWidth = cellWidth + gutterWidth;
              const unitHeight = cellHeight + gutterHeight;

              return {
                x: Math.round(pixelPosition.x / unitWidth),
                y: Math.round(pixelPosition.y / unitHeight),
              };
            },

            setBreakpoint: (breakpoint) =>
              set((state) => {
                state.currentBreakpoint = breakpoint;
              }),

            selectBricks: (ids) => {
              set((state) => {
                state.selectedIds = new Set(ids);
                state.bricks.forEach((brick) => {
                  brick.selected = ids.includes(brick.id);
                });
              });
            },

            toggleSelection: (id) => {
              set((state) => {
                const brick = state.bricks.find((b) => b.id === id);
                if (!brick) return;

                if (state.selectedIds.has(id)) {
                  state.selectedIds.delete(id);
                  brick.selected = false;
                } else {
                  state.selectedIds.add(id);
                  brick.selected = true;
                }
              });
            },

            addBrick: (brick) => {
              set((state) => {
                // @ts-ignore
                state.bricks.push({ ...brick, selected: false });
              });
            },

            deselectAll: () => {
              set((state) => {
                state.selectedIds = new Set();
                state.bricks.forEach((brick) => {
                  brick.selected = false;
                });
              });
            },

            removeBrick: (id) => {
              set((state) => {
                state.bricks = state.bricks.filter((brick) => brick.id !== id);
              });
            },

            updateBrickPosition: (id, position) => {
              set((state) => {
                const brick = state.bricks.find((b) => b.id === id);
                if (!brick) return;
                // @ts-ignore
                const maxX = state.gridConfig.cols[state.currentBreakpoint] - brick.size.w;
                brick.position[state.currentBreakpoint] = {
                  x: Math.max(0, Math.min(position.x, maxX)),
                  y: Math.max(0, position.y),
                };
              });
            },

            updateBrickSize: (id, size) => {
              set((state) => {
                const brick = state.bricks.find((b) => b.id === id);
                if (!brick) return;

                const maxWidth = state.gridConfig.cols[state.currentBreakpoint];
                // @ts-ignore
                brick.size = {
                  w: Math.max(1, Math.min(size.w, maxWidth)),
                  h: Math.max(1, size.h),
                };
              });
            },

            startGroupDrag: () => {
              set((state) => {
                // @ts-ignore
                state.dragStartPositions = new Map(
                  state.bricks
                    .filter((brick) => state.selectedIds.has(brick.id))
                    .map((brick) => [brick.id, { ...brick.position[state.currentBreakpoint] }]),
                );
              });
            },

            updateGroupDrag: (dragOffset) => {
              set((state) => {
                const cols = state.gridConfig.cols[state.currentBreakpoint];
                state.bricks.forEach((brick) => {
                  if (!state.selectedIds.has(brick.id)) return;

                  const startPos = state.dragStartPositions.get(brick.id);
                  if (!startPos) return;

                  // Convert pixel offset to grid position
                  const pixelPos = {
                    x: get().getPixelPosition(startPos).x + dragOffset.x,
                    y: get().getPixelPosition(startPos).y + dragOffset.y,
                  };
                  const snappedPos = get().snapToGrid(pixelPos);

                  brick.position[state.currentBreakpoint] = {
                    x: Math.max(0, Math.min(snappedPos.x, cols - brick.size.w)),
                    y: Math.max(0, snappedPos.y),
                  };
                });
              });
            },

            commitGroupDrag: () => {
              set((state) => {
                state.dragStartPositions.clear();
              });
            },

            setContainerWidth: (width) => {
              set((state) => {
                state.gridConfig.containerWidth = width;
              });
            },

            getCols: () => {
              return get().gridConfig.cols[get().currentBreakpoint];
            },
          })),
          {
            name: `grid-state-${initProps.pageConfig.id}`,
            skipHydration: true,
            partialize: (state) =>
              Object.fromEntries(Object.entries(state).filter(([key]) => !["selectedBrick"].includes(key))),
          },
        ),
        // limit undo history to 100
        { limit: 100 },
      ),
    ),
  );
};

type GridStore = ReturnType<typeof createGridStore>;
