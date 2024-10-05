/**
 * This file is loaded in the context of the iframe.
 * It is responsible for loading all editor-related code.
 */
import editorCss from "@enpage/style-system/editor.css?url";
import type {
  IframeFocusedPayload,
  IframeBlurredPayload,
  ElementSelectedPayload,
  DomUpdatedPayload,
  EditorMessage,
  EditorDragOverPayload,
  EditorDropPayload,
} from "./types";

const currentURL = new URL(import.meta.url);
const editorHost = `${currentURL.hostname}:3008`;
const editorOrigin = `${currentURL.protocol}//${editorHost}`;

export function initEditor(win: Window, doc: Document) {
  console.log("Iframe editor initialized", win, doc);

  importStyles(doc);
  handleTouch(win);
}

function importStyles(doc: Document) {
  // add editor.css
  const editorCssEl = doc.createElement("link");
  editorCssEl.rel = "stylesheet";
  editorCssEl.href = editorCss;
  doc.head.appendChild(editorCssEl);
}

function handleTouch(win: Window) {
  win.addEventListener("focus", () => {
    win.parent.postMessage({ type: "iframe-focused" } satisfies IframeFocusedPayload, editorOrigin);
  });
}
