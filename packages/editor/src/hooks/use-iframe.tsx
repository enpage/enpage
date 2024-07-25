import { useEditor } from "./use-editor-store";
import { type RefObject, useEffect, useState, useRef } from "react";
import type { IframeMessage, EditorMessage } from "@enpage/sdk/browser/dev-client";
import isEqual from "lodash-es/isEqual";
import { isChromeLike } from "../utils/is-safari";

export default function useIframeMonitor(iframeRef: RefObject<HTMLIFrameElement>) {
  const editor = useEditor();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const listener = (event: MessageEvent) => {
      // const data = event.data;
      if (event.source === iframe.contentWindow) {
        const payload = event.data as IframeMessage;
        console.log("iframe message", payload);
        switch (payload.type) {
          case "iframe-focused":
            iframeRef.current?.focus();
            break;
          case "element-selected":
            editor.setSelectedElement(payload.element);
            break;
        }
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [iframeRef.current, editor.setSelectedElement]);
}

const sendIframeMessageThrottle = throttleDedup((iframe: HTMLIFrameElement, payload: EditorMessage) => {
  sendIframeMessage(iframe, payload);
}, 20);

export function useDragOverIframe(iframe: RefObject<HTMLIFrameElement>) {
  const [dragging, setDragging] = useState(false);
  const draggedElement = useRef<HTMLElement | null>(null);
  const touchGhost = useRef<HTMLDivElement | null>(null);
  const editor = useEditor();

  useEffect(() => {
    const touchListener = (e: TouchEvent) => {
      console.log(e.type, e);
      switch (e.type) {
        case "touchstart": {
          if (e.targetTouches.length > 1) {
            console.warn("multiple touches, ignoring");
            e.preventDefault();
            return;
          }

          if (e.target instanceof HTMLElement && e.target.getAttribute("draggable") === "true") {
            setDragging(true);
            draggedElement.current = e.target;
            const touchLocation = e.targetTouches[0];
            touchGhost.current = createMobileDragGhost(
              e.target,
              touchLocation.clientX,
              touchLocation.clientY,
            );
            document.body.appendChild(touchGhost.current);

            setTimeout(() => {
              // clone the original dragged element, make it absolute, and append it to the body
              editor.setLibraryVisible(false);
            }, 200);
          }
          break;
        }

        case "touchmove": {
          // e.preventDefault();
          // if (e.type === "drop") {
          //   console.debug("%s: %o", e.type, e);
          // }
          const touchLocation = e.targetTouches[0];

          // ignore if the mouse is over the dialog panel
          const hoveredElement = document.elementFromPoint(touchLocation.pageX, touchLocation.pageY);
          if (hoveredElement?.classList.contains("dialog-panel")) {
            console.warn("hovered dialog panel, skipping");
            // return true;
          }

          if (touchGhost.current) {
            touchGhost.current.style.top = `${touchLocation.clientY}px`;
            touchGhost.current.style.left = `${touchLocation.clientX}px`;
          }
          // ignore if the mouse is outside the iframe
          const coordinates = translateToIframeCoords(
            iframe.current!,
            touchLocation.clientX,
            touchLocation.clientY,
          );
          if (coordinates.x < 0 || coordinates.y < 0) {
            console.warn("outside iframe", coordinates);
            return true;
          }
          sendIframeMessageThrottle(iframe.current!, {
            type: `editor-dragover`,
            template: draggedElement.current!.dataset.blockTemplate!,
            coordinates,
          });
          // e.preventDefault();
          break;
        }

        case "touchend":
        case "touchcancel":
          if (touchGhost.current) {
            document.body.removeChild(touchGhost.current);
            touchGhost.current = null;
          }
          setDragging(false);
          break;
      }
    };
    const mouseListener = (e: DragEvent) => {
      // console.log(e.type);
      switch (e.type) {
        case "dragstart": {
          setDragging(true);
          if (isChromeLike() && e.dataTransfer) {
            e.dataTransfer.dropEffect = "copy";
            e.dataTransfer.effectAllowed = "copyMove";
          }
          draggedElement.current = e.target as HTMLElement;
          break;
        }

        case "drop":
        case "dragover": {
          e.preventDefault();
          // if (e.type === "drop") {
          //   console.debug("%s: %o", e.type, e);
          // }
          // ignore if the mouse is over the dialog panel
          const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
          if (hoveredElement?.classList.contains("dialog-panel")) {
            console.debug("hovered dialog panel, skipping");
            return true;
          }
          // ignore if the mouse is outside the iframe
          const coordinates = translateToIframeCoords(iframe.current!, e.clientX, e.clientY);
          if (coordinates.x < 0 || coordinates.y < 0) {
            return true;
          }
          sendIframeMessageThrottle(iframe.current!, {
            type: `editor-${e.type}`,
            template: draggedElement.current!.dataset.blockTemplate!,
            coordinates,
          });
          // e.preventDefault();
          break;
        }

        case "dragend":
          document.body.classList.remove("dragging");
          draggedElement.current = null;
          setDragging(false);
          sendIframeMessage(iframe.current!, {
            type: `editor-dragend`,
          });
          break;

        case "dragenter":
          e.preventDefault();
          break;
      }
    };
    // listen for drag* events
    window.addEventListener("dragstart", mouseListener, false);
    window.addEventListener("dragend", mouseListener, false);
    window.addEventListener("drop", mouseListener, false);
    window.addEventListener("dragenter", mouseListener, false);
    // This is a trick to make dragend event fire immediately
    // https://stackoverflow.com/a/65910078
    document.addEventListener("dragover", mouseListener, false);

    window.addEventListener("touchstart", touchListener, false);
    window.addEventListener("touchmove", touchListener, false);
    window.addEventListener("touchcancel", touchListener, false);
    window.addEventListener("touchend", touchListener, false);

    return () => {
      window.removeEventListener("dragstart", mouseListener);
      window.removeEventListener("dragend", mouseListener);
      window.removeEventListener("drop", mouseListener);

      window.removeEventListener("touchstart", touchListener);
      window.removeEventListener("touchmove", touchListener);
      window.removeEventListener("touchcancel", touchListener);
      window.removeEventListener("touchend", touchListener);
    };
  }, [iframe.current, editor.setLibraryVisible]);

  useEffect(() => {
    if (iframe.current) {
      iframe.current.style.pointerEvents = dragging ? "none" : "auto";
    }
  }, [dragging, iframe.current]);

  return { dragging };
}

/**
 * Used to create a custom drag clone on mobile since we just use the touch events and not the drag events.
 */
function createMobileDragGhost(from: HTMLElement, x: number, y: number) {
  const ghost = document.createElement("div");
  const targetStyle = window.getComputedStyle(from);
  const targetBox = from.getBoundingClientRect();
  // clone the original drag image
  const clone = from.cloneNode(true);
  if (clone) {
    ghost.appendChild(clone);
  }
  Object.assign(ghost.style, {
    position: "fixed",
    top: `${x}px`,
    left: `${y}px`,
    borderRadius: targetStyle.borderRadius,
    width: `${targetBox.width}px`,
    minWidth: `${targetBox.width}px`,
    display: "flex",
    height: `${targetBox.height}px`,
    minHeight: `${targetBox.height}px`,
    borderWidth: targetStyle.borderWidth,
    borderColor: targetStyle.borderColor,
    borderStyle: targetStyle.borderStyle,
    backgroundColor: targetStyle.backgroundColor,
    opacity: "0.8",
  });
  ghost.setAttribute("id", "touch-ghost");
  // Add the drag image to the document temporarily
  return ghost;
}

export function sendIframeMessage(iframe: HTMLIFrameElement, payload: unknown, targetOrigin = "*") {
  console.log("iframe payload", payload);
  iframe.contentWindow?.postMessage(payload, targetOrigin);
}

function translateToIframeCoords(iframe: HTMLIFrameElement, x: number, y: number) {
  const rect = iframe.getBoundingClientRect();
  return { x: x - rect.left, y: y - rect.top };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per every `wait` milliseconds,
 * and prevents calling the function twice in a row with deeply equal arguments.
 *
 * @param func The function to throttle.
 * @param wait The number of milliseconds to throttle invocations to.
 * @return Returns the new throttled function.
 */
function throttleDedup<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastExecuted = 0;
  let lastArgs: Parameters<T> | null = null;

  return function (this: any, ...args: Parameters<T>): void {
    const now = Date.now();

    // If the arguments are deeply equal to last time, don't execute
    if (lastArgs && isEqual(lastArgs, args)) {
      return;
    }

    if (!lastExecuted || now - lastExecuted >= wait) {
      func.apply(this, args);
      lastExecuted = now;
      lastArgs = args;
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(
        () => {
          if (now - lastExecuted >= wait) {
            func.apply(this, args);
            lastExecuted = now;
            lastArgs = args;
          }
        },
        wait - (now - lastExecuted),
      );
    }
  };
}
