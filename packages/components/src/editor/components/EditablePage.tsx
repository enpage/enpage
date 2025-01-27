import { css, tx } from "@upstart.gg/style-system/twind";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { generateId, type Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "./EditableBrick";
import {
  useAttributes,
  useBricks,
  useDraft,
  useEditorHelpers,
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
import { useHotkeys } from "react-hotkeys-hook";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import Selecto from "react-selecto";
import { useEditablePage } from "~/editor/hooks/use-draggable";
import { debounce } from "lodash-es";
import { defaults } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import { canDropOnLayout, detectCollisions, getDropOverGhostPosition } from "~/shared/utils/layout-utils";

const ghostValid = tx("bg-upstart-100");
const ghostInvalid = tx("bg-red-100");

export default function EditablePage() {
  const previewMode = usePreviewMode();
  // const setSelectedGroup = useSetSelectedGroup();
  const editorHelpers = useEditorHelpers();
  const selectedBrick = useSelectedBrick();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const attributes = useAttributes();
  const bricks = useBricks();
  const [colWidth, setColWidth] = useState(0);
  const dragOverRef = useRef<HTMLDivElement>(null);
  const pageClassName = usePageStyle({ attributes, editable: true, previewMode });

  // const [draggingOverPos, setDraggingOverPos] = useState<null | {
  //   y: number;
  //   x: number;
  //   h: number;
  //   w: number;
  // }>(null);

  // on page load, set last loaded property so that the store is saved to local storage
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    draft.setLastLoaded();
  }, []);

  function updateDragOverGhostStyle(
    info: ReturnType<typeof canDropOnLayout | typeof getDropOverGhostPosition>,
  ) {
    if (info) {
      dragOverRef.current?.style.setProperty("opacity", "1");
      dragOverRef.current?.style.setProperty("grid-column", `${info.x + 1} / span ${info.w}`);
      dragOverRef.current?.style.setProperty("grid-row", `${info.y + 1} / span ${info.h}`);
      dragOverRef.current?.style.setProperty("display", "block");
      if (info.forbidden) {
        dragOverRef.current?.classList.toggle(ghostInvalid, true);
        dragOverRef.current?.classList.toggle(ghostValid, false);
      } else {
        dragOverRef.current?.classList.toggle(ghostInvalid, false);
        dragOverRef.current?.classList.toggle(ghostValid, true);
      }
    } else {
      dragOverRef.current?.style.setProperty("opacity", "0");
    }
  }

  useEditablePage(".brick", pageRef, {
    dragOptions: {
      enabled: previewMode === "desktop",
    },
    gridConfig: {
      colWidth,
      rowHeight: LAYOUT_ROW_HEIGHT,
      containerHorizontalPadding:
        previewMode === "desktop" ? parseInt(attributes.$pagePaddingHorizontal as string) : 10,
      containerVerticalPadding:
        previewMode === "desktop" ? parseInt(attributes.$pagePaddingVertical as string) : 10,
    },
    dragCallbacks: {
      onDragMove(brick, pos, gridPosition) {
        const dropOverPos = getDropOverGhostPosition({
          brick,
          bricks: draft.bricks,
          currentBp: previewMode,
          dropPosition: gridPosition,
        });
        // console.log("%o", dropOverPos);
        updateDragOverGhostStyle(dropOverPos);
        // editorHelpers.setCollidingBrick(dropOverPos.collision);
      },
      onDragEnd: (brick, pos, gridPos) => {
        console.log("onDragEnd (%s)", previewMode, gridPos);

        const collisions = detectCollisions({
          brick,
          bricks: draft.bricks,
          currentBp: previewMode,
          dropPosition: gridPos,
        });

        if (collisions.length) {
          console.warn("Collisions detected, cancelling drop");
          // reset the selected group
          editorHelpers.setSelectedGroup();
          updateDragOverGhostStyle(false);
          return;
        }

        draft.updateBrickPosition(brick.id, previewMode, {
          ...draft.getBrick(brick.id)!.position[previewMode],
          x: gridPos.x,
          y: gridPos.y,
        });
        // reset the selected group
        editorHelpers.setSelectedGroup();
        updateDragOverGhostStyle(false);
      },
    },
    dropCallbacks: {
      onDropMove(event, gridPosition, brick) {
        const canDrop = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints);
        updateDragOverGhostStyle(canDrop);
      },
      onDropDeactivate() {
        updateDragOverGhostStyle(false);
      },
      onDrop(event, gridPosition, brick) {
        console.log("onDrop (%s)", previewMode, gridPosition, brick);
        const position = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints);
        if (position) {
          const bricksDefaults = defaults[brick.type];
          const newBrick: Brick = {
            id: `brick-${generateId()}`,
            ...bricksDefaults,
            type: brick.type,
            position: {
              desktop: position,
              mobile: position,
              [previewMode]: position,
            },
          };
          draft.addBrick(newBrick);

          // rewrite the mobile layout based on the desktop layout
          draft.adjustMobileLayout();
        } else {
          console.warn("Can't drop here");
        }
      },
    },
    resizeCallbacks: {
      onResizeEnd: (brickId, pos, gridPos) => {
        console.log("onResizeEnd (%s)", previewMode, brickId, gridPos);
        draft.updateBrickPosition(brickId, previewMode, {
          ...draft.getBrick(brickId)!.position[previewMode],
          w: gridPos.w,
          h: gridPos.h,
          // when resizing trhough the mobile view, set the manual height
          // so that the system knows that the height is not automatic
          ...(previewMode === "mobile" ? { manualHeight: gridPos.h } : {}),
        });

        if (previewMode === "mobile") {
          draft.adjustMobileLayout();
        }
      },
    },
  });

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (pageRef.current) {
        const containerWidth = pageRef.current.offsetWidth;
        const totalGapWidth = parseInt(attributes.$pagePaddingHorizontal as string) * 2;
        const availableWidth = containerWidth - totalGapWidth;
        setColWidth(availableWidth / LAYOUT_COLS[previewMode]);
      }
    }, 250);

    updateCellWidth();

    // mutation oberver for the page container styles
    const observer = new MutationObserver(updateCellWidth);
    observer.observe(pageRef.current as Node, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", updateCellWidth, { passive: true });

    return () => {
      window.removeEventListener("resize", updateCellWidth);
      observer.disconnect();
    };
  }, [previewMode, attributes.$pagePaddingHorizontal]);

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
        !target.closest('[role="dialog"]') &&
        !target.closest('[role="toolbar"]') &&
        !target.closest('[role="navigation"]') &&
        !target.matches('[role="menuitem"]') &&
        !target.matches("html") &&
        !target.matches(".brick") &&
        !target.closest(".brick")
      ) {
        console.debug("click out, hidding", event);
        editorHelpers.deselectBrick();
        // also deselect the library panel
        editorHelpers.hidePanel("library");
        editorHelpers.setTextEditMode("default");
      }
    };
    document.addEventListener("click", listener, false);
    return () => {
      document.removeEventListener("click", listener, false);
    };
  }, []);

  useHotkeys("esc", () => {
    editorHelpers.deselectBrick();
    editorHelpers.setPanel();
  });

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.log("mod+c pressed");
    }
  });

  useHotkeys(["backspace", "del"], (e) => {
    if (selectedBrick) {
      e.preventDefault();
      draft.deleteBrick(selectedBrick.id);
    }
  });

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (selectedBrick) {
      draft.duplicateBrick(selectedBrick.id);
    }
  });

  return (
    <>
      <div ref={pageRef} className={pageClassName}>
        {bricks
          .filter((b) => !b.position[previewMode]?.hidden)
          .map((brick, index) => (
            <BrickWrapper key={`${previewMode}-${brick.id}`} brick={brick}>
              <ResizeHandle direction="s" />
              <ResizeHandle direction="n" />
              <ResizeHandle direction="w" />
              <ResizeHandle direction="e" />
            </BrickWrapper>
          ))}
        <div
          ref={dragOverRef}
          className={tx("drop-indicator bg-upstart-100 rounded transition-all opacity-0 hidden")}
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
            editorHelpers.setSelectedGroup(e.selected.map((el) => el.id));
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
