import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";
import type { ResizableOptions } from "@interactjs/actions/resize/plugin";
import { useGetBrick, usePreviewMode } from "./use-editor";

interface DragCallbacks {
  onDragMove?: (event: Interact.InteractEvent, position: { x: number; y: number }) => void;
  onDragEnd?: (
    brickId: string,
    position: { x: number; y: number },
    gridPosition: { col: number; row: number },
    event: Interact.InteractEvent,
  ) => void;
}

interface ResizeCallbacks {
  onResizeStart?: (event: Interact.InteractEvent) => void;
  onResizeMove?: (
    event: Interact.InteractEvent,
    size: { width: number; height: number; x: number; y: number },
  ) => void;
  onResizeEnd?: (
    event: Interact.InteractEvent,
    size: { width: number; height: number; x: number; y: number },
  ) => void;
}

interface UseInteractOptions {
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  dragOptions?: Partial<DraggableOptions>;
  resizeOptions?: Partial<ResizableOptions>;
  dragRestrict?: Partial<RestrictOptions>;
  dragCallbacks?: DragCallbacks;
  resizeCallbacks?: ResizeCallbacks;
  gridConfig: GridConfig;
}

interface InteractMethods {
  enable: () => void;
  disable: () => void;
  updateDragOptions: (options: Parameters<Interact.Interactable["draggable"]>[0]) => void;
  updateResizeOptions: (options: Parameters<Interact.Interactable["resizable"]>[0]) => void;
}

type QuerySelector = string | RefObject<HTMLElement>;

interface GridConfig {
  colWidth: number;
  rowHeight: number;
  containerHorizontalPadding: number;
  containerVerticalPadding: number;
}

function snapPositionToGrid({
  colWidth = 200, // Width of each column
  rowHeight = 80, // Fixed height of rows
  paddingX = 40, // Horizontal padding
  paddingY = 15, // Vertical padding
}) {
  return function (x: number, y: number) {
    return {
      x: Math.round((x - paddingX) / colWidth) * colWidth + paddingX,
      y: Math.round((y - paddingY) / rowHeight) * rowHeight + paddingY,
      // range: Math.min(colWidth, rowHeight) / 2,
      // range: Infinity,
    };
  };
}

function getGridPosition(element: HTMLElement, config: GridConfig) {
  // Get element's initial position (getBoundingClientRect gives position relative to viewport)
  const rect = element.getBoundingClientRect();
  const container = element.closest(".page-container")!.getBoundingClientRect();

  // Calculate actual position relative to container
  const actualX = rect.left - container.left;
  const actualY = rect.top - container.top;

  // Calculate grid position
  const gridX = Math.round((actualX - config.containerHorizontalPadding) / config.colWidth);
  const gridY = Math.round((actualY - config.containerVerticalPadding) / config.rowHeight);

  return {
    col: Math.max(0, gridX),
    row: Math.max(0, gridY),
  };
}

const getPosition = (event: Interact.InteractEvent) => {
  const target = event.target as HTMLElement;
  const x = parseFloat(target.dataset.x || "0") + event.dx;
  const y = parseFloat(target.dataset.y || "0") + event.dy;
  return { x, y };
};

// Update element transform
const updateElementTransform = (target: HTMLElement, x: number, y: number) => {
  console.log("updateElementTransform", x, y);
  // Ensure we clear any existing transform first
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.dataset.x = String(x);
  target.dataset.y = String(y);
};

export const useEditableBrick = (
  ref: QuerySelector,
  {
    gridConfig,
    dragEnabled = true,
    resizeEnabled = true,
    dragOptions = {},
    resizeOptions = {},
    dragCallbacks = {},
    resizeCallbacks = {},
  }: UseInteractOptions,
): InteractMethods => {
  // Helper to get size from event
  const getSize = useCallback((event: Interact.ResizeEvent) => {
    const target = event.target as HTMLElement;
    const rect = event.rect || { width: 0, height: 0 };
    const x = parseFloat(target.dataset.x || "0") + (event.deltaRect?.left || 0);
    const y = parseFloat(target.dataset.y || "0") + (event.deltaRect?.top || 0);
    return {
      width: rect.width,
      height: rect.height,
      x,
      y,
    };
  }, []);

  const getBrick = useGetBrick();
  const previewMode = usePreviewMode();

  // Update element size
  // const updateElementSize = useCallback(
  //   (
  //     target: HTMLElement,
  //     { width, height, x, y }: { width: number; height: number; x: number; y: number },
  //   ) => {
  //     target.style.width = `${width}px`;
  //     target.style.height = `${height}px`;
  //     updateElementTransform(target, x, y);
  //     Object.assign(target.dataset, { x, y, width, height });
  //   },
  //   [updateElementTransform],
  // );

  const interactable = useRef<Interact.Interactable | null>(null);

  useEffect(() => {
    if (typeof ref !== "string" && !ref.current) return;

    interactable.current = interact(typeof ref === "string" ? ref : (ref.current as HTMLElement));

    if (dragEnabled) {
      interactable.current.draggable({
        // hold: 20,
        inertia: true,
        autoScroll: true,
        modifiers: [
          interact.modifiers.snap({
            targets: [
              snapPositionToGrid({
                colWidth: gridConfig.colWidth, // Your column width
                rowHeight: gridConfig.rowHeight, // Your fixed row height
                paddingX: gridConfig.containerHorizontalPadding, // Your container padding
                paddingY: gridConfig.containerVerticalPadding, // Your container padding
              }),
            ],
            offset: "parent",
            relativePoints: [{ x: 0, y: 0 }],
            endOnly: true,
          }),
          interact.modifiers.restrict({
            restriction: "parent",
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            offset: {
              left: gridConfig.containerHorizontalPadding,
              top: gridConfig.containerVerticalPadding,
              bottom: gridConfig.containerVerticalPadding,
              right: gridConfig.containerHorizontalPadding,
            },
          }),
        ],
        listeners: {
          move: (event: Interact.InteractEvent) => {
            const position = getPosition(event);
            updateElementTransform(event.target as HTMLElement, position.x, position.y);
          },
          end: (event: Interact.InteractEvent) => {
            const target = event.target as HTMLElement;
            const position = getPosition(event);
            const gridPosition = getGridPosition(target, gridConfig);
            // Clear transform and data attributes
            target.style.transform = "";
            target.dataset.x = "0";
            target.dataset.y = "0";
            // call back
            dragCallbacks.onDragEnd?.(target.id, position, gridPosition, event);
          },
        },
        ...dragOptions,
      });
    }

    if (resizeEnabled) {
      interactable.current.resizable({
        inertia: true,
        listeners: {
          start: (event) => {
            console.log("start resize", event);
            resizeCallbacks.onResizeStart?.(event);
          },
          move: (event) => {
            console.log("resizing", event);
            event.stopPropagation();
            // test
            let { x, y } = event.target.dataset;

            x = parseFloat(x ?? "0") + event.deltaRect.left;
            y = parseFloat(y ?? "0") + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
            // end test
            // resizeCallbacks.onResizeMove?.(event, size);
          },
          end: (event) => {
            console.log("end resize", event);
            const size = getSize(event);
            resizeCallbacks.onResizeEnd?.(event, size);
          },
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          interact.modifiers.restrictSize({
            // a function that returns the max/min width/height based on the target's current dimensions
            // @ts-ignore
            min: (x, y, event) => {
              const elementId = event.element?.id; // Access the element ID
              if (!elementId) return { width: 0, height: 0 };
              const minW = getBrick(elementId)?.position[previewMode].minW;
              const minH = getBrick(elementId)?.position[previewMode].minH;
              return {
                width: minW ? minW * gridConfig.colWidth : gridConfig.colWidth,
                height: minH ? minH * gridConfig.rowHeight : gridConfig.rowHeight,
              };
            },
            // @ts-ignore
            max: (x, y, event) => {
              const elementId = event.element?.id; // Access the element ID
              if (!elementId) return { width: Infinity, height: Infinity };
              const maxW = getBrick(elementId)?.position[previewMode].maxW;
              const maxH = getBrick(elementId)?.position[previewMode].maxH;
              return {
                width: maxW ? maxW * gridConfig.colWidth : Infinity,
                height: maxH ? maxH * gridConfig.rowHeight : Infinity,
              };
            },
          }),
          // snap TEST
          interact.modifiers.snapSize({
            targets: [interact.snappers.grid({ width: gridConfig.colWidth, height: gridConfig.rowHeight })],
            endOnly: true,
          }),
          ...(resizeOptions.modifiers || []),
        ],
        edges: {
          top: ".react-resizable-handle-n",
          left: ".react-resizable-handle-w",
          bottom: ".react-resizable-handle-s",
          right: ".react-resizable-handle-e",
        },
        ...resizeOptions,
      });
    }

    return () => {
      console.log("cleanup use-draggable");
      interactable.current?.unset();
      interactable.current = null;
    };
  }, [
    ref,
    dragCallbacks,
    resizeCallbacks,
    dragEnabled,
    dragOptions,
    resizeOptions,
    getSize,
    resizeEnabled,
    getBrick,
    previewMode,
    // updateElementSize,
    gridConfig,
  ]);

  // Methods to control the interaction
  /**
   * Enable the draggable or resizable interaction
   */
  const enable = useCallback(() => {
    if (dragEnabled) interactable.current?.draggable(true);
    if (resizeEnabled) interactable.current?.resizable(true);
  }, [dragEnabled, resizeEnabled]);

  /**
   * Disable the draggable or resizable interaction
   */
  const disable = useCallback(() => {
    if (dragEnabled) interactable.current?.draggable(false);
    if (resizeEnabled) interactable.current?.resizable(false);
  }, [dragEnabled, resizeEnabled]);

  /**
   * Update the draggable options
   */
  const updateDragOptions = useCallback((options: Parameters<Interact.Interactable["draggable"]>[0]) => {
    interactable.current?.draggable(options);
  }, []);

  /**
   * Update the resizable options
   */
  const updateResizeOptions = useCallback((options: Parameters<Interact.Interactable["resizable"]>[0]) => {
    interactable.current?.resizable(options);
  }, []);

  return {
    enable,
    disable,
    updateDragOptions,
    updateResizeOptions,
  };
};

interface ElementRefs {
  setRef: (id: string, node: HTMLElement | null) => void;
  getRef: (id: string) => HTMLElement | undefined;
}

export const useElementRefs = (): ElementRefs => {
  const elementRefs = useRef(new Map<string, HTMLElement>());

  const setRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      elementRefs.current.set(id, node);
    } else {
      elementRefs.current.delete(id);
    }
  }, []);

  const getRef = useCallback((id: string) => {
    return elementRefs.current.get(id);
  }, []);

  return { setRef, getRef };
};
