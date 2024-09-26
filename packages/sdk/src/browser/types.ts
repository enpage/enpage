import type { Static } from "@sinclair/typebox";
import type { BlockManifest } from "./components/base/ep-block-base";

export type ElementSelectedPayload = {
  type: "element-selected";
  element: {
    tagName: string;
    innerHTML: string;
    innerText: string;
    outerHTML: string;
    computedStyles: string;
    attributes: Record<string, string>;
    manifest: BlockManifest | null;
  };
};

export type DomUpdatedPayload = {
  type: "dom-updated";
  body: string;
  head: string;
};

export type IframeFocusedPayload = {
  type: "iframe-focused";
};

export type IframeBlurredPayload = {
  type: "iframe-blurred";
};

export type IframeMessage =
  | ElementSelectedPayload
  | DomUpdatedPayload
  | IframeFocusedPayload
  | IframeBlurredPayload;

export type EditorDragEndPayload = {
  type: "editor-dragend";
};

export type EditorDragOverPayload = {
  type: "editor-dragover";
  block: Static<BlockManifest>;
  manifest: BlockManifest;
  coordinates: { x: number; y: number };
};

export type EditorDropPayload = {
  type: "editor-drop";
  block: Static<BlockManifest>;
  manifest: BlockManifest;
  coordinates: { x: number; y: number };
};

export type EditorMessage = EditorDragEndPayload | EditorDragOverPayload | EditorDropPayload;
