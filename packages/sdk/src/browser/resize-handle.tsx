import type { RefObject } from "react";
import { tx } from "./twind";

export default function getResizeHandle(
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
