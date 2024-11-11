import interact from "interactjs";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RestrictOptions } from "@interactjs/modifiers/restrict/pointer";
import type { DraggableOptions } from "@interactjs/actions/drag/plugin";

// interface DragOptions {
//   listeners?: {
//     start?: (event: Interact.InteractEvent) => void;
//     end?: (event: Interact.InteractEvent) => void;
//     move?: (event: Interact.InteractEvent) => void;
//   };
// }

interface ResizeOptions {
  listeners?: {
    start?: (event: Interact.InteractEvent) => void;
    end?: (event: Interact.InteractEvent) => void;
    move?: (event: Interact.InteractEvent) => void;
  };
  edges?: {
    top?: boolean;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
  };
  minWidth?: number;
  minHeight?: number;
}

type UseEditableBrickOptions = {
  drag?: Omit<Partial<DraggableOptions>, "listeners">;
  restrict?: Partial<RestrictOptions>;
  resize?: ResizeOptions;
};

export const useEditableBrick = (
  ref: RefObject<HTMLElement>,
  dragListeners: DraggableOptions["listeners"],
  options: UseEditableBrickOptions = {
    restrict: {
      restriction: "parent",
      endOnly: false,
    },
    drag: {},
  },
): void => {
  useEffect(() => {
    if (!ref.current) return;
    const interactable = interact(ref.current)
      .draggable({
        ...options.drag,
        inertia: true,
        modifiers: [interact.modifiers.restrictRect(options.restrict)],
        autoScroll: true,
        listeners: {
          move: (event: Interact.InteractEvent) => {
            const target = event.target as HTMLElement;
            const x = parseFloat(target.getAttribute("data-x") || "0") + event.dx;
            const y = parseFloat(target.getAttribute("data-y") || "0") + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            // todo: check if setting attribute is necessary
            target.dataset.x = x.toString();
            target.dataset.y = y.toString();
            target.setAttribute("data-x", x.toString());
            target.setAttribute("data-y", y.toString());
          },
          ...(dragListeners ?? {}),
        },
      })
      .resizable(options.resize ?? {});

    return () => {
      interactable.unset();
    };
  }, [ref, dragListeners, options]);
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
