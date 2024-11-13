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

import "./EditablePage.css";

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
  const [draggingOrResizing, setDraggingOrResizing] = useState(false);

  useEditableBrick(".brick", {
    gridConfig: {
      colWidth,
      rowHeight: LAYOUT_ROW_HEIGHT,
      containerHorizontalPadding: LAYOUT_PADDING[editor.previewMode][0],
      containerVerticalPadding: LAYOUT_PADDING[editor.previewMode][1],
    },
    dragCallbacks: {
      onDragStart: () => {
        setDraggingOrResizing(true);
      },
      onDragEnd: (brickId, pos, gridPos) => {
        const currentPos = draft.getBrick(brickId)!.position[editor.previewMode];
        console.log("brick id %s changed from %o to %o", brickId, currentPos, gridPos);
        draft.updateBrickPosition(brickId, editor.previewMode, {
          ...draft.getBrick(brickId)!.position[editor.previewMode],
          x: gridPos.col,
          y: gridPos.row,
        });
        setDraggingOrResizing(false);
      },
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
        setColWidth(availableWidth / LAYOUT_COLS[editor.previewMode]);
      }
    }, 250);

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
          "grid group/page mx-auto w-full @container page-container relative",
          {
            "w-full max-w-7xl min-h-[100dvh] h-full": editor.previewMode === "desktop",
            // todo: use theme or attributes for bg color
            "bg-white min-h-[100%] max-w-full": editor.previewMode !== "desktop",
            // "dragging-or-resizing": draggingOrResizing,
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
            <BrickWrapper key={brick.id} brick={brick}>
              <ResizeHandle direction="s" />
              <ResizeHandle direction="n" />
              <ResizeHandle direction="w" />
              <ResizeHandle direction="e" />
            </BrickWrapper>
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

function ResizeHandle({
  direction,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
}) {
  return (
    <div
      className={tx(
        "react-resizable-handle absolute z-10 transition-opacity duration-200 opacity-0",
        "group-hover/brick:opacity-50 hover:!opacity-100 overflow-visible border-dashed border-upstart-600/80 hover:border-upstart-600",
        `react-resizable-handle-${direction}`,
        {
          "bottom-px left-px right-px h-1 w-[inherit] border-b cursor-s-resize": direction === "s",
          "top-px left-px bottom-px w-1 h-[inherit] border-l cursor-w-resize": direction === "w",
          "top-px right-px bottom-px w-1 h-[inherit] border-r cursor-e-resize": direction === "e",
          "top-px left-px right-px h-1 w-[inherit] border-t cursor-n-resize": direction === "n",

          // sw and nw
          "bottom-px left-px w-1 h-1 border-l border-b cursor-sw-resize": direction === "sw",
          "top-px left-px w-1 h-1 border-l border-t cursor-nw-resize": direction === "nw",

          // se and ne
          "bottom-px right-px w-1 h-1 border-r border-b cursor-se-resize": direction === "se",
          "top-px right-px w-1 h-1 border-r border-t cursor-ne-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx("absolute w-[7px] h-[7px] bg-orange-400 z-10 shadow-sm", {
          "top-1/2 -translate-y-1/2 -left-[4px]": direction === "w",
          "top-1/2 -translate-y-1/2 -right-[4px]": direction === "e",
          "left-1/2 -translate-x-1/2 -top-[4px]": direction === "n",
          "left-1/2 -translate-x-1/2 -bottom-[4px]": direction === "s",

          // sw and nw
          "-bottom-[4px] -left-[4px]": direction === "sw",
          "-top-[4px] -left-[4px]": direction === "nw",

          // se and ne
          "-bottom-[4px] -right-[4px]": direction === "se",
          "-top-[4px] -right-[4px]": direction === "ne",
        })}
      />
    </div>
  );
}
