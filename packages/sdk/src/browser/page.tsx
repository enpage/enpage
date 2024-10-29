import { tx, css } from "./twind";
import {
  Ref,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DOMAttributes,
} from "react";
import { type BrickPosition, GRID_COLS, type Brick } from "~/shared/bricks";
import BrickWrapper from "./brick";
import { useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";
import { type ItemCallback, Responsive, WidthProvider } from "react-grid-layout";

// const ResponsiveGridLayout = WidthProvider(Responsive);

import {
  arraySwap,
  SortableContext,
  rectSwappingStrategy,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  type DragStartEvent,
  type Active,
  type DragOverEvent,
  type Over,
  type DragEndEvent,
  type CollisionDetection,
  pointerWithin,
  rectIntersection,
  type Modifier,
  type DragMoveEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToVerticalAxis, createSnapModifier } from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";

export default function Page(props: { initialBricks?: Brick[]; onMount?: () => void }) {
  const editorEnabled = useEditorEnabled();
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const hasBeenDragged = useRef(false);

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  // const { lock, unlock } = useScrollLock({
  //   autoLock: false,
  // });

  // listen for global click events on the document
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const event = e as MouseEvent;
      const elementAtPoint = event.target as HTMLElement;
      if (
        !elementAtPoint.closest("[data-radix-popper-content-wrapper]") &&
        !elementAtPoint.closest("[data-radix-select-viewport]") &&
        !elementAtPoint.closest("#floating-panel") &&
        !elementAtPoint.matches(".brick")
      ) {
        console.info("deselecting brick because user clicked outside");
        editor.deselectBrick();
      } else if (elementAtPoint.matches(".brick")) {
        console.info("selecting brick because user clicked on a brick");
        editor.setSelectedBrick(draft.getBrick(elementAtPoint.id));
      }
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  });

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   // compute the grid col size from the pageRef width / 12
  //   if (pageRef.current) {
  //     setGridColSize(pageRef.current.clientWidth / 12);
  //     props.onMount?.();
  //   }
  // }, []);

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.log("mod+c pressed");
    }
  });

  const bricks = useMemo(() => {
    return editorEnabled ? draft.bricks : props.initialBricks ?? [];
  }, [editorEnabled, props.initialBricks, draft.bricks]);

  const layoutMobile = bricks.map((brick) => ({
    i: brick.id,
    // let's consider there is at least one position set
    ...((brick.position.mobile ?? brick.position.tablet ?? brick.position.desktop) as BrickPosition),
  }));

  const layoutTablet = bricks.map((brick) => ({
    i: brick.id,
    // let's consider there is at least one position set
    ...((brick.position.tablet ?? brick.position.mobile ?? brick.position.desktop) as BrickPosition),
  }));

  const layoutDesktop = bricks.map((brick) => ({
    i: brick.id,
    // let's consider there is at least one position set
    ...((brick.position.desktop ?? brick.position.tablet ?? brick.position.mobile) as BrickPosition),
  }));

  // check if an element is overflown
  const isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }: HTMLElement) => {
    console.log({ clientWidth, clientHeight, scrollWidth, scrollHeight });
    // 4px margin of error
    return scrollHeight > clientHeight + 4 || scrollWidth > clientWidth + 4;
  };

  const onDragStart: ItemCallback = (e) => {
    console.log("drag start", e);
  };

  const onDragStop: ItemCallback = (layout, oldItem, newItemn, placeholder, event, element) => {
    console.log("drag end", element);

    if (!hasBeenDragged.current) {
      console.log("element has not been dragged", element);
      // fire a click event on the brick
      const clickEvent = new MouseEvent("click", { bubbles: true });
      element.dispatchEvent(clickEvent);
    } else {
      // deselect the brick
      editor.deselectBrick();
    }

    hasBeenDragged.current = false;
  };

  const onDrag: ItemCallback = (e) => {
    hasBeenDragged.current = true;
    console.log("drag", e);
  };

  return (
    <ResponsiveGridLayout
      innerRef={pageRef}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onLayoutChange={(layout, layouts) => {
        console.log("layout change", layout, layouts);
      }}
      onResizeStop={(layout, oldItem, newItem, placeholder, event, element) => {
        const brick = draft.getBrick(newItem.i);
        const brickElement = document.getElementById(newItem.i);
        const brickIsOverflown = brickElement ? isOverflown(brickElement) : false;
        console.log("resize stop", { brickElement, brick, brickIsOverflown });
      }}
      preventCollision={false}
      // @ts-ignore wrong types in library
      resizeHandle={getResizeHandle}
      // all directions
      resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
      // todo: get max witdth from page attributes
      className={tx("layout", "mx-auto max-w-7xl min-h-[100dvh]")}
      layouts={{
        mobile: layoutMobile,
        tablet: layoutTablet,
        desktop: layoutDesktop,
      }}
      cols={{
        mobile: 2,
        tablet: 4,
        desktop: 12,
      }}
      margin={[0, 0]}
      breakpoints={{ desktop: 1024, tablet: 768, mobile: 0 }}
      rowHeight={20}
      autoSize={false}
      // width={1200}
    >
      {bricks.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </ResponsiveGridLayout>
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
          "bottom-0 left-0 right-0 h-1 w-[inherit] border-b cursor-s-resize": resizeHandle === "s",
          "top-0 left-0 bottom-0 w-1 h-[inherit] border-l cursor-w-resize": resizeHandle === "w",
          "top-0 right-0 bottom-0 w-1 h-[inherit] border-r cursor-e-resize": resizeHandle === "e",
          "top-0 left-0 right-0 h-1 w-[inherit] border-t cursor-n-resize": resizeHandle === "n",

          // sw and nw
          "bottom-0 left-0 w-1 h-1 border-l border-b cursor-sw-resize": resizeHandle === "sw",
          "top-0 left-0 w-1 h-1 border-l border-t cursor-nw-resize": resizeHandle === "nw",

          // se and ne
          "bottom-0 right-0 w-1 h-1 border-r border-b cursor-se-resize": resizeHandle === "se",
          "top-0 right-0 w-1 h-1 border-r border-t cursor-ne-resize": resizeHandle === "ne",
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
