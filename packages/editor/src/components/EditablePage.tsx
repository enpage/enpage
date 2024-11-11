import { tx } from "@enpage/style-system/twind";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { type BrickPosition, type Brick, generateId } from "@enpage/sdk/shared/bricks";
import BrickWrapper from "./Brick";
import { useBricks, useDraft, useEditor } from "../hooks/use-editor";
import { type DragOverEvent, type ItemCallback, type Layout, Responsive } from "react-grid-layout";
import WidthProvider from "./WidthProvideRGL";
import { useHotkeys } from "react-hotkeys-hook";
import invariant from "@enpage/sdk/shared/utils/invariant";
import {
  LAYOUT_BREAKPOINTS,
  LAYOUT_COLS,
  LAYOUT_GUTTERS,
  LAYOUT_PADDING,
  LAYOUT_ROW_HEIGHT,
} from "../config/layout-constants";
import { findOptimalPosition } from "../utils/layout-utils";
import Selecto from "react-selecto";

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

  // const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  // const { lock, unlock } = useScrollLock({
  //   autoLock: false,
  // });

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

  const layoutMobile = useMemo(
    () =>
      bricks.map((brick) => ({
        i: brick.id,
        ...((brick.position.mobile ?? brick.position.tablet ?? brick.position.desktop) as BrickPosition),
      })),
    [bricks],
  );

  const layoutTablet = useMemo(
    () =>
      bricks.map((brick) => ({
        i: brick.id,
        ...((brick.position.tablet ?? brick.position.mobile ?? brick.position.desktop) as BrickPosition),
      })),
    [bricks],
  );

  const layoutDesktop = useMemo(
    () =>
      bricks.map((brick) => ({
        i: brick.id,
        ...((brick.position.desktop ?? brick.position.tablet ?? brick.position.mobile) as BrickPosition),
      })),
    [bricks],
  );

  const onDragStart: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    hasDraggedStarted.current = true;

    if (!editor.selectedGroup?.includes(oldItem.i)) {
      editor.setSelectedGroup([oldItem.i]);
    }

    // Store the initial mouse offset relative to the grid item
    const rect = element.getBoundingClientRect();
    dragInfo.current = {
      isDragging: true,
      startOffset: {
        x: rect.left,
        y: rect.top,
      },
      draggedId: oldItem.i,
    };

    setDragTranslate({ x: 0, y: 0 });
  };

  const onDrag: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    if (!dragInfo.current.isDragging) return;

    // ignore if the brick has not been dragged
    if (oldItem.x === newItem.x && oldItem.y === newItem.y) {
      return;
    }

    hasBeenDragged.current = true;

    // compute the delta between the initial drag position and the current one
    // Calculate dx and dy including margins
    const rect = element.getBoundingClientRect();
    const dx = rect.left - dragInfo.current.startOffset.x;
    const dy = rect.top - dragInfo.current.startOffset.y;

    // update the dragged brick position
    setDragTranslate({ x: dx, y: dy });
  };

  const onDragStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    console.log("drag stop", { event });
    const target = event.target as HTMLElement | null;
    if (!hasBeenDragged.current && !target?.matches(".rt-BaseMenuItem")) {
      // simulate a click event on the brick
      const clickEvent = new MouseEvent("click", { bubbles: true });
      element.dispatchEvent(clickEvent);
    } else if (hasBeenDragged.current) {
      // deselect the brick if it has been dragged
      editor.deselectBrick();
    }

    const dx = newItem.x - oldItem.x;
    const dy = newItem.y - oldItem.y;

    // Update actual layout positions
    if (hasBeenDragged.current && dragInfo.current.startOffset && editor.selectedGroup?.length) {
      editor.selectedGroup?.forEach((id) => {
        const brick = draft.getBrick(id);
        if (brick) {
          const layoutType = editor.previewMode;
          const layout = brick.position[layoutType];
          if (layout) {
            console.log("updating brick position for %s", id);
            draft.updateBrickPosition(id, layoutType, {
              ...layout,
              // make sure the value is not <0 and not > max
              x: Math.min(Math.max(0, layout.x + dx), 12),
              y: Math.max(0, layout.y + dy),
            });
          }
        }
      });
      editor.setSelectedGroup([]);
      setDragTranslate({ x: 0, y: 0 });

      dragInfo.current = {
        isDragging: false,
        startOffset: null,
        draggedId: null,
      };
    }

    hasBeenDragged.current = false;
    hasDraggedStarted.current = false;
  };

  const onResizeStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    const brick = draft.getBrick(newItem.i);
    invariant(brick, "brick not found");

    const brickElement = document.getElementById(newItem.i);
    invariant(brickElement, "brick element not found");

    // update brick position
    const layoutType = editor.previewMode;
    console.log("updating brick position", newItem);
    draft.updateBrick(brick.id, {
      position: {
        ...brick.position,
        [layoutType]: newItem,
      },
    });
  };

  const onDrop = (layout: Layout[], item: Layout, event: Event) => {
    console.log("drop", item);

    if (editor.draggingBrick) {
      const id = `brick-${generateId()}`;

      const optimalPos = findOptimalPosition(
        {
          mobile: layoutMobile,
          tablet: layoutTablet,
          desktop: layoutDesktop,
        },
        editor.draggingBrick,
      );

      const desktopPosition = editor.previewMode === "desktop" ? { ...item, i: id } : optimalPos.desktop;
      const tabletPosition = editor.previewMode === "tablet" ? { ...item, i: id } : optimalPos.tablet;
      const mobilePosition = editor.previewMode === "mobile" ? { ...item, i: id } : optimalPos.mobile;

      draft.addBrick({
        type: editor.draggingBrick.type,
        props: { ...editor.draggingBrick.props, z: bricks.length + 1 },
        id,
        position: {
          desktop: desktopPosition,
          tablet: tabletPosition,
          mobile: mobilePosition,
        },
      });
      // reset dragging brick
      editor.setDraggingBrick();
    }
  };

  const onDropDragOver = (event: DragOverEvent): { w?: number; h?: number } | false | undefined => {
    // console.log("onDropDragOver", event, editor.draggingBrick);
    return editor.draggingBrick
      ? {
          w: editor.draggingBrick.preferredW,
          h: editor.draggingBrick.preferredH,
        }
      : undefined;
  };

  const onWidthChange = (width: number) => {
    const margin = LAYOUT_GUTTERS[editor.previewMode];
    const cols = LAYOUT_COLS[editor.previewMode];
    const containerPadding = margin[0];
    const totalMargin = (cols - 1) * margin[0];
    const usableWidth = width - totalMargin - containerPadding * 2;
    const calculatedColWidth = usableWidth / cols;
    setColWidth(calculatedColWidth);
  };

  return (
    <>
      <ResponsiveGridLayout
        breakpoint={editor.previewMode}
        innerRef={pageRef}
        isDroppable={true}
        onDrag={onDrag}
        onDropDragOver={onDropDragOver}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        draggableCancel=".nodrag"
        // useCSSTransforms={false}
        // @ts-ignore wrong types in library
        resizeHandle={getResizeHandle}
        // all directions
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        // todo: get max witdth from page attributes
        className={tx("group/page mx-auto w-full @container page-container", {
          "w-full max-w-7xl min-h-[100dvh] h-full": editor.previewMode === "desktop",
          // todo: use theme or attributes for bg color
          "bg-white min-h-[100%] max-w-full max-h-full": editor.previewMode !== "desktop",
        })}
        layouts={{
          mobile: layoutMobile,
          tablet: layoutTablet,
          desktop: layoutDesktop,
        }}
        cols={LAYOUT_COLS}
        // Margin between grid items
        margin={LAYOUT_GUTTERS}
        // Padding of the main layout container
        containerPadding={LAYOUT_PADDING}
        breakpoints={LAYOUT_BREAKPOINTS}
        rowHeight={LAYOUT_ROW_HEIGHT}
        // No auto resizing, we want to manage the whole page size
        autoSize={false}
        // No compacting unless on mobile, as we want the user to be able to place the bricks wherever they want
        compactType={editor.previewMode === "mobile" ? "vertical" : null}
        allowOverlap={true}
        // preventCollision={true}
        onWidthChange={onWidthChange}
        onLayoutChange={(layout, layouts) => {
          return false;
        }}
      >
        {bricks
          .filter((b) => !b.position[editor.previewMode]?.hidden)
          .map((brick) => (
            <BrickWrapper
              key={brick.id}
              brick={brick}
              translation={
                dragInfo.current.isDragging &&
                dragInfo.current.draggedId !== brick.id &&
                editor.selectedGroup?.includes(brick.id)
                  ? dragTranslate
                  : undefined
              }
            />
          ))}
      </ResponsiveGridLayout>
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
