import { tx, css } from "./twind";
import {
  Ref,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DOMAttributes,
} from "react";
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
    hasBeenDragged.current = true;
    if (!dragInfo.current.isDragging) return;

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
      console.log("deselcting brick because it has been dragged");
      editor.deselectBrick();
    }

    const dx = newItem.x - oldItem.x;
    const dy = newItem.y - oldItem.y;

    // Update actual layout positions
    if (dragInfo.current.startOffset && editor.selectedGroup?.length) {
      // reset group selection

      editor.selectedGroup?.forEach((id) => {
        const brick = draft.getBrick(id);
        if (brick) {
          const layoutType = editor.previewMode;
          const layout = brick.position[layoutType];
          if (layout) {
            console.log("updating brick position", id, layoutType, layout, dx, dy);
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
        useCSSTransforms={false}
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
