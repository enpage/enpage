import { createStore, useStore } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "@enpage/sdk/shared/responsive";
import type { Brick, BrickPosition, BricksLayout } from "@enpage/sdk/shared/bricks";
import type { AttributesResolved } from "@enpage/sdk/shared/attributes";
import { generateId, type BrickManifest } from "@enpage/sdk/shared/bricks";
import type { GenericPageConfig, PageBasicInfo } from "@enpage/sdk/shared/page";
export { type Immer } from "immer";
import type { Static } from "@sinclair/typebox";

export interface GridStateProps {
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   */
  layout: BricksLayout;
}

export interface GridState extends GridStateProps {
  setLayout: (layout: BricksLayout) => void;
}

export const createGridStore = (
  initProps: Partial<GridStateProps> & { pageConfig: GenericPageConfig; pages: PageBasicInfo[] },
) => {
  const DEFAULT_PROPS: Omit<GridStateProps, "replace_me"> = {
    layout: [],
  };

  return createStore<GridState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,
            setLayout: (layout) =>
              set((state) => {
                state.layout = layout;
              }),
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
