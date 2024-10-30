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
import { useDraft, useEditor, useEditorEnabled } from "./use-editor";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";
import { type ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { LAYOUT_COLS, LAYOUT_GUTTERS, LAYOUT_PADDING, LAYOUT_ROW_HEIGHT } from "./constants";
// const ResponsiveGridLayout = WidthProvider(Responsive);
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import invariant from "~/shared/utils/invariant";
import { LAYOUT_BREAKPOINTS } from "./constants";

export default function Page(props: { initialBricks?: Brick[]; onMount?: () => void }) {
  const editorEnabled = useEditorEnabled();
  const editor = useEditor();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const hasBeenDragged = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), [editor.previewMode]);

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
      } else if (elementAtPoint.matches(".brick") && !hasBeenDragged.current) {
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
      measureBeforeMount={true}
      breakpoint={editor.previewMode}
      innerRef={pageRef}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onLayoutChange={(layout, layouts) => {
        console.log("layout change", layout, layouts);
      }}
      onResizeStop={(layout, oldItem, newItem, placeholder, event, element) => {
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

        // For now, there is no need to update the width
        //
        // Update the newItem width by computing the equivalent numbers of cols missing
        // Uses LAYOUT_COLS to compute it
        // if (typeof overflow.w === "number") {
        //   console.log("Updating brick width to fit content");
        //   newItem.w += Math.ceil(overflow.w / LAYOUT_COLS.desktop);
        // }

        console.log("resize stop", {
          brick,
          oldItem,
          newItem,
          overflow,
        });

        // update brick position
        const layoutType = editor.previewMode;
        draft.updateBrick(brick.id, {
          position: {
            ...brick.position,
            [layoutType]: newItem,
          },
        });
      }}
      preventCollision={false}
      // @ts-ignore wrong types in library
      resizeHandle={getResizeHandle}
      // all directions
      resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
      // todo: get max witdth from page attributes
      className={tx("group/page mx-auto w-full @container", {
        "max-w-7xl min-h-[100dvh]": editor.previewMode === "desktop",
        // todo: use theme or attributes for bg color
        "bg-white min-h-[100%]": editor.previewMode !== "desktop",
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
      compactType={"vertical"}
      // allowOverlap={false}
    >
      {bricks.map((brick) => (
        <BrickWrapper key={brick.id} data-grid={brick.position[editor.previewMode]} brick={brick} />
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
