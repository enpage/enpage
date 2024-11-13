import { css, tx } from "@enpage/style-system/twind";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { type BrickPosition, type Brick, generateId } from "@enpage/sdk/shared/bricks";
import BrickWrapper from "./Brick2";
import { useBricks, useDraft, useEditor } from "../hooks/use-editor";
import { type DragOverEvent, type ItemCallback, type Layout, Responsive } from "react-grid-layout";
import WidthProvider from "./WidthProvideRGL";
import { useHotkeys } from "react-hotkeys-hook";
import invariant from "@enpage/sdk/shared/utils/invariant";
import {
  LAYOUT_BREAKPOINTS,
  LAYOUT_COLS,
  // LAYOUT_GUTTERS,
  LAYOUT_PADDING,
  LAYOUT_ROW_HEIGHT,
} from "../config/layout-constants";
import { adjustLayoutHeight, findOptimalPosition } from "../utils/layout-utils";
import Selecto from "react-selecto";
import { useEditableBrick } from "~/hooks/use-draggable";
import { debounce } from "lodash-es";

// @ts-ignore wrong types in library
const ResponsiveGridLayout = WidthProvider(Responsive);

type DragInfo =
  | {
      isDragging: true;
      startOffset: { x: number; y: number };
      draggedId: string;
    }
  | {
      isDragging: false;
      startOffset: null;
      draggedId: null;
    };

export default function EditablePage(props: { initialBricks?: Brick[]; onMount?: () => void }) {
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const hasBeenDragged = useRef(false);
  const hasDraggedStarted = useRef(false);
  const bricks = useBricks();
  const [dragTranslate, setDragTranslate] = useState({ x: 0, y: 0 });
  const dragInfo = useRef<DragInfo>({
    isDragging: false,
    startOffset: null,
    draggedId: null,
  });
  const [colWidth, setColWidth] = useState(0);

  useEditableBrick(".brick", {
    gridConfig: {
      colWidth,
      rowHeight: LAYOUT_ROW_HEIGHT,
      containerHorizontalPadding: LAYOUT_PADDING[editor.previewMode][0],
      containerVerticalPadding: LAYOUT_PADDING[editor.previewMode][1],
    },
  });

  // const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  // const { lock, unlock } = useScrollLock({
  //   autoLock: false,
  // });

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (pageRef.current) {
        const containerWidth = pageRef.current.offsetWidth;
        const totalGapWidth = LAYOUT_PADDING[editor.previewMode][0] * 2;
        const availableWidth = containerWidth - totalGapWidth;
        setColWidth(Math.ceil(availableWidth / LAYOUT_COLS[editor.previewMode]));
      }
    }, 150);

    updateCellWidth();
    window.addEventListener("resize", updateCellWidth);
    return () => window.removeEventListener("resize", updateCellWidth);
  }, [editor.previewMode]);

  // listen for global click events on the document
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement;
      if (
        !target.closest("[data-radix-popper-content-wrapper]") &&
        !target.closest("[data-radix-select-viewport]") &&
        !target.closest("#floating-panel") &&
        !target.closest('[role="toolbar"]') &&
        !target.closest('[role="navigation"]') &&
        !target.matches("html") &&
        !target.matches(".brick") &&
        !target.closest(".brick")
      ) {
        editor.deselectBrick();
        // also deslect the library panel
        editor.hidePanel("library");
      }
    };
    document.addEventListener("click", listener, false);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  useHotkeys("esc", () => {
    editor.deselectBrick();
  });

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.log("mod+c pressed");
    }
  });

  useHotkeys(["backspace", "del"], (e) => {
    if (editor.selectedBrick && editor.selectedBrick) {
      e.preventDefault();
      draft.deleteBrick(editor.selectedBrick.id);
    }
  });

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (editor.selectedBrick) {
      draft.duplicateBrick(editor.selectedBrick.id);
    }
  });

  return (
    <>
      <div
        ref={pageRef}
        className={tx(
          "grid group/page mx-auto w-full @container page-container",
          {
            "w-full max-w-7xl min-h-[100dvh] h-full": editor.previewMode === "desktop",
            // todo: use theme or attributes for bg color
            "bg-white min-h-[100%] max-w-full": editor.previewMode !== "desktop",
          },
          css({
            gridTemplateColumns: `repeat(${LAYOUT_COLS[editor.previewMode]}, minmax(0, 1fr))`,
            gridAutoRows: `${LAYOUT_ROW_HEIGHT}px`,
            padding: `${LAYOUT_PADDING[editor.previewMode][1]}px ${LAYOUT_PADDING[editor.previewMode][0]}px`,
          }),
        )}
      >
        {bricks
          .filter((b) => !b.position[editor.previewMode]?.hidden)
          .map((brick) => (
            <BrickWrapper key={brick.id} brick={brick} />
          ))}
      </div>
      <Selecto
        className="selecto"
        selectableTargets={[".brick"]}
        selectFromInside={false}
        hitRate={1}
        selectByClick={false}
        onSelect={(e) => {
          editor.setSelectedGroup(e.selected.map((el) => el.id));
          e.added.forEach((el) => {
            console.log("selected", el);
            el.classList.add("selected");
          });
          e.removed.forEach((el) => {
            console.log("deselected", el);
            el.classList.remove("selected");
          });
        }}
      />
    </>
  );
}

function getResizeHandle(
  resizeHandle: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne",
  ref: RefObject<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={tx(
        "react-resizable-handle absolute z-10 transition-opacity duration-200 opacity-0",
        "group-hover/brick:opacity-50 hover:!opacity-100 overflow-visible border-dashed border-upstart-600/80 hover:border-upstart-600",
        `react-resizable-handle-${resizeHandle}`,
        {
          "bottom-px left-px right-px h-1 w-[inherit] border-b cursor-s-resize": resizeHandle === "s",
          "top-px left-px bottom-px w-1 h-[inherit] border-l cursor-w-resize": resizeHandle === "w",
          "top-px right-px bottom-px w-1 h-[inherit] border-r cursor-e-resize": resizeHandle === "e",
          "top-px left-px right-px h-1 w-[inherit] border-t cursor-n-resize": resizeHandle === "n",

          // sw and nw
          "bottom-px left-px w-1 h-1 border-l border-b cursor-sw-resize": resizeHandle === "sw",
          "top-px left-px w-1 h-1 border-l border-t cursor-nw-resize": resizeHandle === "nw",

          // se and ne
          "bottom-px right-px w-1 h-1 border-r border-b cursor-se-resize": resizeHandle === "se",
          "top-px right-px w-1 h-1 border-r border-t cursor-ne-resize": resizeHandle === "ne",
        },
      )}
    >
      <div
        className={tx("absolute w-[7px] h-[7px] bg-orange-400 z-10 shadow-sm", {
          "top-1/2 -translate-y-1/2 -left-[4px]": resizeHandle === "w",
          "top-1/2 -translate-y-1/2 -right-[4px]": resizeHandle === "e",
          "left-1/2 -translate-x-1/2 -top-[4px]": resizeHandle === "n",
          "left-1/2 -translate-x-1/2 -bottom-[4px]": resizeHandle === "s",

          // sw and nw
          "-bottom-[4px] -left-[4px]": resizeHandle === "sw",
          "-top-[4px] -left-[4px]": resizeHandle === "nw",

          // se and ne
          "-bottom-[4px] -right-[4px]": resizeHandle === "se",
          "-top-[4px] -right-[4px]": resizeHandle === "ne",
        })}
      />
    </div>
  );
}
