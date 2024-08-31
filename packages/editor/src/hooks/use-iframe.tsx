import { useEditor } from "./use-editor-store";
import { type RefObject, useEffect, useRef } from "react";
import type { IframeMessage } from "@enpage/sdk/browser/dev-client";
import { isEqual } from "lodash-es";
import { isChromeLike } from "../utils/is-safari";
import invariant from "@enpage/sdk/utils/invariant";
import debug from "debug";

const log = debug("editor:use-iframe");

// Utility functions
const translateToIframeCoords = (iframe: HTMLIFrameElement, x: number, y: number) => {
  const rect = iframe.getBoundingClientRect();
  return { x: x - rect.left, y: y - rect.top };
};

const sendIframeMessage = (iframe: HTMLIFrameElement, payload: unknown, targetOrigin = "*") => {
  log("sending iframe message", payload);
  iframe.contentWindow?.postMessage(payload, targetOrigin);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const dedup = <T extends (...args: any[]) => any>(func: T): ((...args: Parameters<T>) => void) => {
  let lastArgs: Parameters<T> | null = null;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function (this: any, ...args: Parameters<T>): void {
    if (lastArgs && isEqual(lastArgs, args)) return;
    func.apply(this, args);
    lastArgs = args;
  };
};

const sendIframeMessageThrottle = dedup(sendIframeMessage);

// Hook for monitoring iframe messages
export function useIframeMonitor(iframeRef: RefObject<HTMLIFrameElement>) {
  const editor = useEditor();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;

      const payload = event.data as IframeMessage;
      log("iframe message", payload);

      switch (payload.type) {
        case "iframe-focused":
          iframe.focus();
          break;
        case "element-selected":
          editor.setSelectedElement(payload.element);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef.current, editor.setSelectedElement]);
}

// Hook for handling drag and touch events over iframe
export function useDragOverIframe(iframe: RefObject<HTMLIFrameElement>) {
  const draggedElement = useRef<HTMLElement | null>(null);
  const touchGhost = useRef<HTMLDivElement | null>(null);
  const editor = useEditor();

  useEffect(() => {
    const handleTouchEvent = (e: TouchEvent) => {
      switch (e.type) {
        case "touchstart":
          handleTouchStart(e);
          break;
        case "touchmove":
          handleTouchMove(e);
          break;
        case "touchend":
        case "touchcancel":
          handleTouchEnd(e);
          break;
      }
    };

    const handleMouseEvent = (e: DragEvent) => {
      switch (e.type) {
        case "dragstart":
          handleDragStart(e);
          break;
        case "drop":
        case "dragover":
          handleDragOverOrDrop(e);
          break;
        case "dragend":
          handleDragEnd(e);
          break;
        case "dragenter":
          e.preventDefault();
          break;
      }
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.targetTouches.length > 1) {
        log("multiple touches, ignoring");
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!iframe.current || !draggedElement.current) return;

      const touchLocation = e.touches[0];

      if (touchGhost.current) {
        updateTouchGhostPosition(touchGhost.current, touchLocation);
      }

      const coordinates = translateToIframeCoords(iframe.current, touchLocation.pageX, touchLocation.pageY);

      if (coordinates.x < 0 || coordinates.y < 0) return true;

      sendIframeMessageThrottle(iframe.current, {
        type: `editor-dragover`,
        template: draggedElement.current.dataset.blockTemplate!,
        coordinates,
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!iframe.current) return;

      if (touchGhost.current) {
        document.body.removeChild(touchGhost.current);
        touchGhost.current = null;
      }

      iframe.current.style.pointerEvents = "auto";

      if (e.type === "touchend" && draggedElement.current) {
        const touchLocation = e.changedTouches[0];
        const coordinates = translateToIframeCoords(iframe.current, touchLocation.pageX, touchLocation.pageY);
        sendIframeMessage(iframe.current, {
          type: `editor-drop`,
          coordinates,
          template: draggedElement.current.dataset.blockTemplate!,
        });
      }

      sendIframeMessage(iframe.current, { type: "editor-dragend" });
      draggedElement.current = null;
    };

    // Mouse event handlers
    const handleDragStart = (e: DragEvent) => {
      if (!iframe.current) return;
      log("dragstart", e.target);
      iframe.current.style.pointerEvents = "none";
      if (isChromeLike() && e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
        e.dataTransfer.effectAllowed = "copyMove";
      }
      draggedElement.current = e.target as HTMLElement;
    };

    const handleDragOverOrDrop = (e: DragEvent) => {
      if (!iframe.current || !draggedElement.current) return;
      e.preventDefault();
      log(e.type);

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      if (hoveredElement?.classList.contains("dialog-panel")) {
        log("skipping dragover on dialog panel");
        return true;
      }

      const coordinates = translateToIframeCoords(iframe.current, e.clientX, e.clientY);
      if (coordinates.x < 0 || coordinates.y < 0) return true;

      sendIframeMessageThrottle(iframe.current, {
        type: `editor-${e.type}`,
        template: draggedElement.current.dataset.blockTemplate!,
        coordinates,
      });

      if (e.type === "drop") {
        iframe.current.style.pointerEvents = "none";
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      log("dragend", e.target);
      invariant(iframe.current, `[${e.type}] iframe must be present`);
      draggedElement.current = null;
      sendIframeMessage(iframe.current, {
        type: `editor-dragend`,
      });
      iframe.current.style.pointerEvents = "none";
    };

    // Event listeners
    window.addEventListener("dragstart", handleMouseEvent, false);
    window.addEventListener("dragend", handleMouseEvent, false);
    window.addEventListener("drop", handleMouseEvent, false);
    window.addEventListener("dragenter", handleMouseEvent, false);
    window.addEventListener("dragover", handleMouseEvent, false);

    window.addEventListener("touchstart", handleTouchEvent, false);
    window.addEventListener("touchmove", handleTouchEvent, false);
    window.addEventListener("touchcancel", handleTouchEvent, false);
    window.addEventListener("touchend", handleTouchEvent, false);

    return () => {
      window.removeEventListener("dragstart", handleMouseEvent);
      window.removeEventListener("dragend", handleMouseEvent);
      window.removeEventListener("drop", handleMouseEvent);
      window.removeEventListener("dragenter", handleMouseEvent);
      window.removeEventListener("dragover", handleMouseEvent);

      window.removeEventListener("touchstart", handleTouchEvent);
      window.removeEventListener("touchmove", handleTouchEvent);
      window.removeEventListener("touchcancel", handleTouchEvent);
      window.removeEventListener("touchend", handleTouchEvent);
    };
  }, [iframe.current, editor.setLibraryVisible]);

  return null;
}

// Helper functions
function createMobileDragGhost(from: HTMLElement, x: number, y: number) {
  const ghost = document.createElement("div");
  const targetStyle = window.getComputedStyle(from);
  const targetBox = from.getBoundingClientRect();
  const clone = from.cloneNode(true);
  if (clone) {
    ghost.appendChild(clone);
  }

  const top = y - targetBox.height - 6;
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
    zIndex: "9999",
  });
  ghost.setAttribute("id", "touch-ghost");
  return ghost;
}

function updateTouchGhostPosition(ghost: HTMLDivElement, touchLocation: Touch) {
  const top = touchLocation.clientY - parseFloat(ghost.style.height) - 6;
  const left = touchLocation.clientX - parseFloat(ghost.style.width) / 2;
  ghost.style.top = `${top}px`;
  ghost.style.left = `${left}px`;
}
