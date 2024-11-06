import { tx, css } from "./twind";
import { Ref, useCallback, useEffect, useMemo, useRef, useState, type DOMAttributes } from "react";
import type { BrickPosition, Brick } from "~/shared/bricks";
import BrickWrapper from "./brick";
import { useBricks, useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";
import { type DragOverEvent, type ItemCallback, type Layout, Responsive } from "react-grid-layout";
import WidthProvider from "./responsive-layout";
import { LAYOUT_COLS, LAYOUT_GUTTERS, LAYOUT_PADDING, LAYOUT_ROW_HEIGHT } from "./constants";
import { useHotkeys } from "react-hotkeys-hook";
import invariant from "~/shared/utils/invariant";
import { LAYOUT_BREAKPOINTS } from "./constants";
import { generateId } from "./bricks/common";
import { findOptimalPosition } from "./layout-utils";
import Selecto from "react-selecto";
import getResizeHandle from "./resize-handle";

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
    console.log("useEffect register click listener");
    const listener = (e: MouseEvent) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement;
      if (
        !target.closest("[data-radix-popper-content-wrapper]") &&
        !target.closest("[data-radix-select-viewport]") &&
        !target.closest("#floating-panel") &&
        !target.closest('[role="toolbar"]') &&
        !target.matches("html") &&
        !target.matches(".brick") &&
        !target.closest(".brick")
      ) {
        console.info("deselecting brick because user clicked outside", event);
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
    console.log("mod+d pressed");
    e.preventDefault();
    if (editor.selectedBrick) {
      console.log("duplicating brick", editor.selectedBrick.id);
      draft.duplicateBrick(editor.selectedBrick.id);
    }
  });

  useEffect(() => {
    console.log("selected group changed", editor.selectedGroup);
  }, [editor.selectedGroup]);

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
    dragInfo.current = {
      isDragging: true,
      startOffset: {
        x: event.clientX,
        y: event.clientY,
      },
      draggedId: oldItem.i,
    };

    setDragTranslate({ x: 0, y: 0 });
  };

  const onDrag: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    hasBeenDragged.current = true;
    if (!dragInfo.current.isDragging) return;

    // compute the delta between the initial drag position and the current one
    // Calculate dx and dy including margins
    const dx = event.clientX - dragInfo.current.startOffset.x;
    const dy = event.clientY - dragInfo.current.startOffset.y;

    console.log("translate", dx, dy);

    // update the dragged brick position
    setDragTranslate({ x: dx, y: dy });
  };

  const onDragStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    if (!hasBeenDragged.current) {
      // simulate a click event on the brick
      const clickEvent = new MouseEvent("click", { bubbles: true });
      element.dispatchEvent(clickEvent);
    } else {
      console.log("deselcting brick because it has been dragged");
      editor.deselectBrick();
    }

    // reset group selection
    setDragTranslate({ x: 0, y: 0 });
    dragInfo.current = {
      isDragging: false,
      startOffset: null,
      draggedId: null,
    };

    const { h, w, x, y, maxH, maxW, minH, minW } = newItem;

    setTimeout(() => {
      // for whatever reason, we have to delay the updateBrickPosition call
      // so that the grid library does not throw weird errors
      draft.updateBrickPosition(newItem.i, editor.previewMode, { h, w, x, y, maxH, maxW, minH, minW });
      hasBeenDragged.current = false;
      hasDraggedStarted.current = false;
    }, 200);
  };

  const onResizeStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    console.log("resize stop", newItem);
    const brick = draft.getBrick(newItem.i);
    invariant(brick, "brick not found");

    const brickElement = document.getElementById(newItem.i);
    invariant(brickElement, "brick element not found");

    // update brick position
    const layoutType = editor.previewMode;
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
    console.log("onDropDragOver", event, editor.draggingBrick);
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
        preventCollision={false}
        draggableCancel=".nodrag"
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
        onWidthChange={onWidthChange}
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
