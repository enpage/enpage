import { css, tx } from "@enpage/style-system/twind";
import { useEffect, useRef, useState } from "react";
import { generateId, type Brick } from "@enpage/sdk/shared/bricks";
import BrickWrapper from "./Brick";
import { useAttributes, useBricks, useDraft, useEditor } from "../hooks/use-editor";
import { useHotkeys } from "react-hotkeys-hook";
import { LAYOUT_COLS, LAYOUT_PADDING, LAYOUT_ROW_HEIGHT } from "@enpage/sdk/shared/layout-constants";
import { canDropOnLayout } from "@enpage/sdk/shared/utils/layout-utils";
import Selecto from "react-selecto";
import { useEditablePage } from "~/hooks/use-draggable";
import { debounce } from "lodash-es";
import { defaults } from "../bricks/all-manifests";

import "./EditablePage.css";
import { isStandardColor } from "@enpage/sdk/shared/themes/color-system";

export default function EditablePage(props: { initialBricks?: Brick[]; onMount?: () => void }) {
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const attributes = useAttributes();
  const bricks = useBricks();
  const [colWidth, setColWidth] = useState(0);
  const [draggingOverPos, setDraggingOverPos] = useState<null | {
    y: number;
    x: number;
    h: number;
    w: number;
  }>(null);

  useEditablePage(".brick", pageRef, {
    gridConfig: {
      colWidth,
      rowHeight: LAYOUT_ROW_HEIGHT,
      containerHorizontalPadding: LAYOUT_PADDING[editor.previewMode][0],
      containerVerticalPadding: LAYOUT_PADDING[editor.previewMode][1],
    },
    dragCallbacks: {
      onDragEnd: (brickId, pos, gridPos) => {
        draft.updateBrickPosition(brickId, editor.previewMode, {
          ...draft.getBrick(brickId)!.position[editor.previewMode],
          x: gridPos.x,
          y: gridPos.y,
        });
        editor.setSelectedGroup();
      },
    },
    dropCallbacks: {
      onDropMove(event, gridPosition, brick) {
        const canDrop = canDropOnLayout(draft.bricks, editor.previewMode, gridPosition, brick.constraints);
        setDraggingOverPos(canDrop || null);
      },
      onDropDeactivate() {
        setDraggingOverPos(null);
      },
      onDrop(event, gridPosition, brick) {
        const position = canDropOnLayout(draft.bricks, editor.previewMode, gridPosition, brick.constraints);
        if (position) {
          const bricksDefaults = defaults[brick.type];
          const newBrick: Brick = {
            id: generateId(),
            ...bricksDefaults,
            type: brick.type,
            position: {
              desktop: position,
              mobile: position,
              [editor.previewMode]: position,
            },
          };
          draft.addBrick(newBrick);
        }
      },
    },
    resizeCallbacks: {
      onResizeEnd: (brickId, pos, gridPos) => {
        draft.updateBrickPosition(brickId, editor.previewMode, {
          ...draft.getBrick(brickId)!.position[editor.previewMode],
          w: gridPos.w,
          h: gridPos.h,
        });
      },
    },
  });

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
    window.addEventListener("resize", updateCellWidth, { passive: true });
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
        // also deselect the library panel
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
          "grid group/page mx-auto w-full @container page-container relative transition-all duration-300",
          isStandardColor(attributes.$backgroundColor) &&
            css({ backgroundColor: attributes.$backgroundColor }),
          isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor }),
          !isStandardColor(attributes.$backgroundColor) && attributes.$backgroundColor,
          !isStandardColor(attributes.$textColor) && attributes.$textColor,
          {
            "w-full max-w-screen-2xl min-h-[100dvh] h-full": editor.previewMode === "desktop",
            "min-h-[100%] max-w-full": editor.previewMode !== "desktop",
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

        <div
          className={tx(
            "drop-indicator bg-upstart-400/50 rounded transition-all duration-300",
            css({
              opacity: draggingOverPos ? 1 : 0,
              gridColumn: `${draggingOverPos?.x ?? 0} / span ${draggingOverPos?.w ?? 1}`,
              gridRow: `${draggingOverPos?.y ?? 0} / span ${draggingOverPos?.h ?? 1}`,
              display: draggingOverPos ? "block" : "none",
            }),
          )}
        />
      </div>
      <Selecto
        className="selecto"
        selectableTargets={[".brick"]}
        selectFromInside={false}
        hitRate={1}
        selectByClick={false}
        onSelect={(e) => {
          if (e.selected.length) {
            editor.setSelectedGroup(e.selected.map((el) => el.id));
          }
          e.added.forEach((el) => {
            el.classList.add("selected");
          });
          e.removed.forEach((el) => {
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
