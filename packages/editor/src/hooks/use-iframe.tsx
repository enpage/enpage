import { useDraft, useEditor } from "./use-editor-store";
import { type RefObject, useEffect, useRef } from "react";
import type { IframeMessage } from "@enpage/sdk/browser/types";
import { isEqual } from "lodash-es";
import { isChromeLike, isSafari } from "../utils/is-safari";
import invariant from "@enpage/sdk/utils/invariant";
import type { BlockManifest, Block } from "@enpage/sdk/browser/components/base/ep-block-base";
import { initEditor } from "@enpage/sdk/browser/iframe-editor";
import { unserializeDomData } from "@enpage/sdk/browser/components/utils";
import type { EditorMessage } from "@enpage/sdk/browser/types";
// import { createTwoFilesPatch } from "diff";
import debug from "debug";
import type { Static } from "@sinclair/typebox";

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
export function useIframeMessaging(iframeRef: RefObject<HTMLIFrameElement>) {
  const editor = useEditor();
  const draft = useDraft();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;

      const payload = event.data as IframeMessage;
      // log("message received from iframe", payload);

      switch (payload.type) {
        case "iframe-focused":
          iframe.focus();
          break;
        case "element-selected":
          // console.log("element selected", payload.element);
          editor.setSelectedElement(payload.element);
          break;
        case "dom-updated":
          //
          // console.log("dom updated!!!", payload);
          break;
      }
    };
    // listen for messages from iframe
    window.addEventListener("message", handleMessage);

    // listen for mutations in the iframe
    //   const observer = new MutationObserver(() => {
    //     if (iframe.contentDocument) {
    //       const doc = iframe.contentDocument.cloneNode(true) as Document;
    //       const body = doc.querySelector("body")!;
    //       body.querySelectorAll("[ep-ignore]").forEach((el) => el.remove());
    //       if (draft.body !== body.outerHTML) {
    //         const patch = createTwoFilesPatch("old.html", "new.html", draft.body, body.outerHTML);
    //         console.log("body has changed from %d bytes to %d bytes", draft.body.length, body.outerHTML.length);
    //         draft.setBody(body.outerHTML);
    //       }
    //     }
    //   });

    //   if (iframe.contentDocument) {
    //     observer.observe(iframe.contentDocument, { attributes: false, childList: true, subtree: true });
    //   }

    //   return () => {
    //     window.removeEventListener("message", handleMessage);
    //     observer.disconnect();
    //   };
  }, [iframeRef.current, editor.setSelectedElement /* draft.setBody, draft.body*/]);
}

// Hook for handling drag and touch events over iframe
export function useDragOverIframe(iframe: RefObject<HTMLIFrameElement>) {
  const dragged = useRef<{
    element: HTMLElement;
    block: Static<BlockManifest>;
    manifest: BlockManifest;
  } | null>(null);
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

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.targetTouches.length > 1) {
        log("multiple touches, ignoring");
        e.preventDefault();
        return;
      }

      if (e.target instanceof HTMLElement && e.target.getAttribute("data-block-type")) {
        invariant(iframe.current, "[touchstart] iframe must be present");
        invariant(e.target.dataset.block, "[touchstart] dataset.block must be present");
        invariant(e.target.dataset.manifest, "[touchstart] dataset.manifest must be present");

        iframe.current.style.pointerEvents = "none";

        dragged.current = {
          element: e.target,
          manifest: unserializeDomData<BlockManifest>(e.target.dataset.manifest),
          block: unserializeDomData(e.target.dataset.block),
        };
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
      if (!iframe.current || !dragged.current) return;

      const touchLocation = e.touches[0];

      if (touchGhost.current) {
        updateTouchGhostPosition(touchGhost.current, touchLocation);
      }

      const coordinates = translateToIframeCoords(iframe.current, touchLocation.pageX, touchLocation.pageY);

      if (coordinates.x < 0 || coordinates.y < 0) return true;

      sendIframeMessageThrottle(iframe.current, {
        type: `editor-dragover`,
        block: dragged.current.block,
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

      if (e.type === "touchend" && dragged.current) {
        const touchLocation = e.changedTouches[0];
        const coordinates = translateToIframeCoords(iframe.current, touchLocation.pageX, touchLocation.pageY);
        sendIframeMessage(iframe.current, {
          type: `editor-drop`,
          coordinates,
          block: dragged.current.block,
        });
      }

      sendIframeMessage(iframe.current, { type: "editor-dragend" });
      dragged.current = null;
    };

    // Mouse event handlers
    const handleDragStart = (e: DragEvent) => {
      console.log("drag start", e);
      if (!iframe.current) return;
      const element = e.target as HTMLElement;

      log("dragstart", element);

      // why ?
      // iframe.current.style.pointerEvents = "none";
      if (isChromeLike() && e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
        e.dataTransfer.effectAllowed = "copyMove";
      }

      invariant(element.dataset.block, "[dragstart] dataset.block must be present");
      invariant(element.dataset.manifest, "[dragstart] dataset.manifest must be present");

      dragged.current = {
        element,
        block: unserializeDomData<Block>(element.dataset.block),
        manifest: unserializeDomData<BlockManifest>(element.dataset.manifest),
      };
    };

    const handleDragOverOrDrop = (e: DragEvent) => {
      if (!iframe.current || !dragged.current) {
        log("skipping dragover or drop");
        return;
      }
      e.preventDefault();

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      if (hoveredElement?.classList.contains("dialog-panel")) {
        log("skipping dragover on dialog panel");
        return true;
      }

      const coordinates = isSafari()
        ? translateToIframeCoords(iframe.current, e.clientX, e.clientY)
        : {
            x: e.clientX,
            y: e.clientY,
          };

      if (coordinates.x < 0 || coordinates.y < 0) {
        return true;
      }

      sendIframeMessageThrottle(iframe.current, {
        type: `editor-${e.type}` as "editor-dragover" | "editor-drop",
        block: dragged.current.block,
        manifest: dragged.current.manifest,
        coordinates,
      } satisfies EditorMessage);
    };

    const handleDragEnd = (e: DragEvent) => {
      log("dragend");
      invariant(iframe.current, `[${e.type}] iframe must be present`);
      dragged.current = null;
      sendIframeMessage(iframe.current, {
        type: `editor-dragend`,
      } satisfies EditorMessage);

      // The following code lends to the iframe being totally unresponsive to touch events after the first drop, which is dumb
      // START
      // console.log("drag end, disabling pointer events");
      // iframe.current.style.pointerEvents = "none";
      // END
    };

    const preventEventDefault = (e: Event) => {
      e.preventDefault();
    };

    const abortCtrl = new AbortController();
    const { signal } = abortCtrl;

    // Event listeners
    window.addEventListener("dragstart", handleDragStart, {
      signal,
      capture: false,
    });

    window.addEventListener("dragenter", preventEventDefault, {
      signal,
    });

    if (isSafari()) {
      window.addEventListener("dragover", handleDragOverOrDrop, {
        signal,
        capture: false,
      });
      window.addEventListener("drop", handleDragOverOrDrop, {
        signal,
      });
    } else {
      iframe.current?.contentWindow?.addEventListener("dragover", handleDragOverOrDrop, {
        signal,
      });
      iframe.current?.contentWindow?.addEventListener("drop", handleDragOverOrDrop, {
        signal,
      });
    }

    window.addEventListener("dragend", handleDragEnd, {
      signal,
    });

    iframe.current?.contentWindow?.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON" || target.tagName === "A") {
          e.stopPropagation();
        }

        // e.stopPropagation();
        const el = e.target as HTMLElement;
        // el.style.outline = "2px solid red";
        makeEditable(el);
      },
      {
        signal,
        capture: true,
      },
    );

    // iframe.current?.contentWindow?.addEventListener("dragover", handleMouseEvent, false);

    window.addEventListener("touchstart", handleTouchEvent, {
      signal,
    });
    window.addEventListener("touchmove", handleTouchEvent, {
      signal,
    });
    window.addEventListener("touchcancel", handleTouchEvent, {
      signal,
    });
    window.addEventListener("touchend", handleTouchEvent, {
      signal,
    });

    return () => {
      abortCtrl.abort("cleanup");
    };
  }, [iframe.current, editor.setLibraryVisible]);

  return null;
}

export function useIframeEditor(iframeRef: RefObject<HTMLIFrameElement>) {
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const abortCtrl = new AbortController();
    iframe.addEventListener(
      "load",
      () => {
        initEditor(iframe.contentWindow!, iframe.contentDocument!);
      },
      { signal: abortCtrl.signal },
    );
    return () => {
      abortCtrl.abort();
    };
  }, [iframeRef.current]);
}

/**
 * Makes an HTML element editable with custom behavior:
 * - Prevents creation of div elements on Enter key press
 * - Inserts line breaks instead of new paragraphs
 * - Handles paste events to insert plain text
 * - Cleans up formatting on blur
 *
 * @param element The HTML element to make editable.
 */
function makeEditable(element: HTMLElement): void {
  // console.log("makeEditable", element);

  element.addEventListener("dblclick", function (this: HTMLElement) {
    element.setAttribute("contenteditable", "true");
  });

  element.addEventListener("keydown", function (this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();

      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

      if (range && this.contains(range.commonAncestorContainer)) {
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);

        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } else {
        const br = document.createElement("br");
        this.appendChild(br);

        const newRange = document.createRange();
        newRange.setStartAfter(br);
        newRange.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }

      this.scrollIntoView({ block: "end" });
    }
  });

  element.addEventListener("paste", function (e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") ?? "";
    document.execCommand("insertText", false, text);
  });

  element.addEventListener("blur", function (this: HTMLElement) {
    this.innerHTML = this.innerHTML.replace(/<div>|<br>/gi, " ").trim();
    this.removeAttribute("contenteditable");
  });
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
