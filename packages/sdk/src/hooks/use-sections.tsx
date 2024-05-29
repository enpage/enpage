import { create, createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import invariant from "tiny-invariant";
import { nanoid } from "nanoid";
export { type Immer } from "immer";

type BlockData = {
  id: string;
};

interface SectionsStateProps {
  sections: Record<
    string,
    {
      index: number;
      blocks: BlockData[];
    }
  >;
}

export interface SectionsState extends SectionsStateProps {
  addSection: () => void;
  setBlocks: (sectionId: string, blocks: BlockData[]) => void;
  addBlock: (sectionId: string, block: BlockData) => void;
  updateBlock: (
    sectionId: string,
    blockId: string,
    block: Partial<BlockData>,
  ) => void;
  moveBlock: (sectionId: string, fromIndex: number, toIndex: number) => void;
  replaceBlockAt: (sectionId: string, index: number, data: BlockData) => void;
  insertBlockAt: (sectionId: string, index: number, data: BlockData) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  removeBlockWhere: (
    sectionId: string,
    predicate: (block: BlockData) => boolean,
  ) => void;
}

export const createSectionsStore = (initProps: Partial<SectionsStateProps>) => {
  const DEFAULT_PROPS: SectionsStateProps = { sections: {} };

  return createStore<SectionsState>()(
    temporal(
      persist(
        immer((set, get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          addSection: () => {
            const id = nanoid(5);
            set((state) => {
              state.sections[id] = {
                index: Object.keys(state.sections).length,
                blocks: [],
              };
            });
            return id;
          },
          setBlocks: (sectionId, blocks = []) =>
            set((state) => {
              state.sections[sectionId].blocks = blocks;
            }),
          addBlock: (sectionId, block) =>
            set((state) => {
              state.sections[sectionId].blocks.push(block);
            }),
          updateBlock: (sectionId, id, block) =>
            set((state) => {
              const existingBlock = state.sections[sectionId].blocks.find(
                (b) => b.id === id,
              );
              if (existingBlock) {
                Object.assign(existingBlock, block);
              }
            }),
          replaceBlockAt: (sectionId, index, data) =>
            set((state) => {
              state.sections[sectionId].blocks[index] = data;
            }),
          insertBlockAt: (sectionId, index, data) =>
            set((state) => {
              state.sections[sectionId].blocks.splice(index, 0, data);
            }),
          removeBlock: (sectionId, id) =>
            set((state) => {
              state.sections[sectionId].blocks = state.sections[
                sectionId
              ].blocks.filter((block) => block.id !== id);
            }),
          removeBlockWhere: (sectionId, predicate) =>
            set((state) => {
              state.sections[sectionId].blocks = state.sections[
                sectionId
              ].blocks.filter((block) => !predicate(block));
            }),
          moveBlock: (sectionId, fromIndex, toIndex) =>
            set((state) => {
              state.sections[sectionId].blocks.splice(
                toIndex,
                0,
                state.sections[sectionId].blocks.splice(fromIndex, 1)[0],
              );
            }),
        })),
        {
          name: "sections-store",
          skipHydration: true,
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["blocks"].includes(key),
              ),
            ),
        },
      ),
    ),
  );
};

type SectionsStore = ReturnType<typeof createSectionsStore>;

export const SectionStoreContext = createContext<SectionsStore | null>(null);

export const useSectionsStoreContext = () => {
  const store = useContext(SectionStoreContext);
  invariant(
    store,
    "useSectionsStoreContext must be used within a SectionStoreContext",
  );
  return store;
};

export const useSections = () => {
  const ctx = useSectionsStoreContext();
  return useStore(ctx);
};
