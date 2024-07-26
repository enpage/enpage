import { useEditor } from "./use-editor-store";
import { type RefObject, useEffect, useRef } from "react";
import type { IframeMessage } from "@enpage/sdk/browser/dev-client";
import isEqual from "lodash-es/isEqual";
import { isChromeLike } from "../utils/is-safari";
import invariant from "tiny-invariant";

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

const sendIframeMessageThrottle = dedup(sendIframeMessage);

export function useDragOverIframe(iframe: RefObject<HTMLIFrameElement>) {
  const draggedElement = useRef<HTMLElement | null>(null);
  const touchGhost = useRef<HTMLDivElement | null>(null);
  const editor = useEditor();

  useEffect(() => {
    const touchListener = (e: TouchEvent) => {
      switch (e.type) {
        case "touchstart": {
          if (e.targetTouches.length > 1) {
            console.warn("multiple touches, ignoring");
            e.preventDefault();
            return;
          }

          if (e.target instanceof HTMLElement && e.target.getAttribute("data-block-type")) {
            invariant(iframe.current, "[touchstart] iframe must be present");

            iframe.current.style.pointerEvents = "none";
            draggedElement.current = e.target;
            const touchLocation = e.touches[0];
            const ghost = createMobileDragGhost(e.target, touchLocation.clientX, touchLocation.clientY);
            if (touchGhost.current) {
              document.body.replaceChild(ghost, touchGhost.current);
            } else {
              document.body.appendChild(ghost);
            }
            touchGhost.current = ghost;
            editor.setLibraryVisible(false);
          }
          break;
        }

        case "touchmove": {
          invariant(iframe.current, "[touchmove] iframe must be present");
          invariant(draggedElement.current, "[touchmove] draggedElement must be present");

          const touchLocation = e.touches[0];

          if (touchGhost.current) {
            const top = touchLocation.clientY - parseFloat(touchGhost.current.style.height) - 6;
            const left = touchLocation.clientX - parseFloat(touchGhost.current.style.width) / 2;
            touchGhost.current.style.top = `${top}px`;
            touchGhost.current.style.left = `${left}px`;
          }

          // ignore if the mouse is outside the iframe
          const coordinates = translateToIframeCoords(
            iframe.current,
            touchLocation.pageX,
            touchLocation.pageY,
          );

          // don't send dragover events if the mouse is not over the iframe
          if (coordinates.x < 0 || coordinates.y < 0) {
            return true;
          }

          sendIframeMessageThrottle(iframe.current!, {
            type: `editor-dragover`,
            template: draggedElement.current.dataset.blockTemplate!,
            coordinates,
          });
          break;
        }

        case "touchend":
        case "touchcancel": {
          invariant(iframe.current, `[${e.type}] iframe must be present`);
          invariant(draggedElement.current, `[${e.type}] draggedElement must be present`);

          if (touchGhost.current) {
            console.log("removing touch ghost");
            document.body.removeChild(touchGhost.current);
            touchGhost.current = null;
          }

          iframe.current.style.pointerEvents = "auto";

          if (e.type === "touchend") {
            const touchLocation = e.changedTouches[0];
            if (draggedElement.current) {
              const coordinates = translateToIframeCoords(
                iframe.current,
                touchLocation.pageX,
                touchLocation.pageY,
              );
              sendIframeMessage(iframe.current, {
                type: `editor-drop`,
                coordinates,
                template: draggedElement.current.dataset.blockTemplate!,
              });
            }
          }

          // when using touch, also send dragend event
          sendIframeMessage(iframe.current, { type: "editor-dragend" });

          draggedElement.current = null;
          break;
        }
      }
    };
    const mouseListener = (e: DragEvent) => {
      // console.log(e.type);
      switch (e.type) {
        case "dragstart": {
          invariant(iframe.current, `[${e.type}] iframe must be present`);
          iframe.current.style.pointerEvents = "none";
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
          invariant(iframe.current, `[${e.type}] iframe must be present`);
          invariant(draggedElement.current, `[${e.type}] draggedElement must be present`);

          // ignore if the mouse is over the dialog panel
          const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
          if (hoveredElement?.classList.contains("dialog-panel")) {
            return true;
          }

          // ignore if the mouse is outside the iframe
          const coordinates = translateToIframeCoords(iframe.current, e.clientX, e.clientY);
          if (coordinates.x < 0 || coordinates.y < 0) {
            return true;
          }

          sendIframeMessageThrottle(iframe.current, {
            type: `editor-${e.type}`,
            template: draggedElement.current.dataset.blockTemplate!,
            coordinates,
          });

          if (e.type === "drop") {
            iframe.current.style.pointerEvents = "none";
          }
          break;
        }

        case "dragend":
          invariant(iframe.current, `[${e.type}] iframe must be present`);
          draggedElement.current = null;
          sendIframeMessage(iframe.current!, {
            type: `editor-dragend`,
          });
          iframe.current.style.pointerEvents = "none";
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

  return null;
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
  // Put the ghost at the same position as the original element but a bit higher to make it look like it's being dragged by the finger
  const top = y - targetBox.height - 6;
  // center the ghost horizontally
  const left = x - targetBox.width / 2;

  Object.assign(ghost.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
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
  iframe.contentWindow?.postMessage(payload, targetOrigin);
}

function translateToIframeCoords(iframe: HTMLIFrameElement, x: number, y: number) {
  const rect = iframe.getBoundingClientRect();
  return { x: x - rect.left, y: y - rect.top };
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function dedup<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let lastArgs: Parameters<T> | null = null;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function (this: any, ...args: Parameters<T>): void {
    // If the arguments are deeply equal to last time, don't execute
    if (lastArgs && isEqual(lastArgs, args)) {
      return;
    }

    func.apply(this, args);
    lastArgs = args;
  };
}
