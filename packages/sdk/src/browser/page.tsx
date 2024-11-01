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
import type { BrickPosition, Brick } from "~/shared/bricks";
import BrickWrapper from "./brick";
import { useBricks, useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";
import { type ItemCallback, Responsive } from "react-grid-layout";
import WidthProvider from "./responsive-layout";
import { LAYOUT_COLS, LAYOUT_GUTTERS, LAYOUT_PADDING, LAYOUT_ROW_HEIGHT } from "./constants";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import invariant from "~/shared/utils/invariant";
import { LAYOUT_BREAKPOINTS } from "./constants";

// @ts-ignore wrong types in library
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function EditablePage(props: { initialBricks?: Brick[]; onMount?: () => void }) {
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const hasBeenDragged = useRef(false);
  const hasDraggedStarted = useRef(false);
  const bricks = useBricks();

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
        !target.matches("html") &&
        !target.matches(".brick") &&
        !target.closest(".brick")
      ) {
        console.info("deselecting brick because user clicked outside", event);
        editor.deselectBrick();
      } /*else if (target.matches(".brick") && hasDraggedStarted.current) {
        console.info("selecting brick because user clicked on a brick", event);
        editor.setSelectedBrick(draft.getBrick(target.id));
      } else {
        console.info("not selecting brick", event);
      }*/
    };
    document.addEventListener("click", listener, false);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation

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
      draft.deletebrick(editor.selectedBrick.id);
    }
  });

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (editor.selectedBrick) {
      console.log("duplicating brick", editor.selectedBrick.id);
      // draft.duplicateBrick(editor.selectedBrick.id);
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

  // check if an element is overflown
  const getOverflow = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }: HTMLElement) => {
    console.log({ clientWidth, clientHeight, scrollWidth, scrollHeight });
    const erroMargin = 4;
    let overflowH: false | number = false;
    if (scrollHeight > clientHeight + erroMargin) {
      overflowH = scrollHeight - clientHeight + erroMargin;
    }
    let overflowW: false | number = false;
    if (scrollWidth > clientWidth + erroMargin) {
      overflowW = scrollWidth - clientWidth + erroMargin;
    }
    return { h: overflowH, w: overflowW };
  };

  const onDragStart: ItemCallback = (e) => {
    console.log("drag start", e);
    hasDraggedStarted.current = true;
  };

  const onDragStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    console.log("drag end");

    if (!hasBeenDragged.current) {
      // fire a click event on the brick
      const clickEvent = new MouseEvent("click", { bubbles: true });
      element.dispatchEvent(clickEvent);
    } else {
      console.log("deselcting brick because it has been dragged");
      // deselect the brick
      editor.deselectBrick();
    }

    const { h, w, x, y, maxH, maxW, minH, minW } = newItem;
    // draft.updateBrickPosition(newItem.i, editor.previewMode, { h, w, x, y, maxH, maxW, minH, minW });

    setTimeout(() => {
      // for whatever reason, we have to delay the updateBrickPosition call
      // so that the grid library does not throw weird errors
      draft.updateBrickPosition(newItem.i, editor.previewMode, { h, w, x, y, maxH, maxW, minH, minW });
      hasBeenDragged.current = false;
      hasDraggedStarted.current = false;
    }, 200);
  };

  const onDrag: ItemCallback = (e) => {
    hasBeenDragged.current = true;
    // console.log("drag", e);
  };

  const onResizeStop: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    console.log("resize end", element);
    const brick = draft.getBrick(newItem.i);
    invariant(brick, "brick not found");

    const brickElement = document.getElementById(newItem.i);
    invariant(brickElement, "brick element not found");

    const overflow = getOverflow(brickElement);

    // Update the newItem height by computing the equivalent numbers of rows missing
    // Uses LAYOUT_ROW_HEIGHT to compute it
    if (typeof overflow.h === "number") {
      console.log("Updating brick height to fit content");
      newItem.h += Math.ceil(overflow.h / LAYOUT_ROW_HEIGHT);
    }

    // update brick position
    const layoutType = editor.previewMode;
    draft.updateBrick(brick.id, {
      position: {
        ...brick.position,
        [layoutType]: newItem,
      },
    });
  };

  return (
    <ResponsiveGridLayout
      breakpoint={editor.previewMode}
      innerRef={pageRef}
      onDrag={onDrag}
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
      className={tx("group/page mx-auto w-full @container", {
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
      // No auto resizing, we want  to manage the whole page size
      autoSize={false}
      // No compacting, we want the user to be able to place the bricks wherever they want
      // compactType={"vertical"}
      compactType={null}
      allowOverlap={true}
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
