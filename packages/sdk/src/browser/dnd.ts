import throttle from "lodash-es/throttle";
import { canContain, type Tag } from "./tag-containment-rules";

type Coordinates = { x: number; y: number };

type Params = {
  dragElement: HTMLElement;
  coordinates: Coordinates;
};

type Side = {
  horizontal: "left" | "right";
  vertical: "top" | "bottom";
};

let indicator: HTMLElement | null = null;
let indicatorTimeout: unknown = null;
let rafId: number | null = null;

/**
 * Finds the HTML element closest to given coordinates (x, y).
 * @param x - The x-coordinate of the reference point.
 * @param y - The y-coordinate of the reference point.
 * @param elements - An array of HTML elements to compare against the reference point.
 * @returns The HTML element closest to the given coordinates, or null if no elements are provided.
 */
function findClosestElementToCoordinates(coords: Coordinates, elements: HTMLElement[]): HTMLElement | null {
  let closestElement: HTMLElement | null = null;
  let minDistance = Infinity;

  const { x, y } = coords;

  elements.forEach((element: HTMLElement) => {
    // Skip the <body> and <html> elements
    if (element.tagName === "BODY" || element.tagName === "HTML") {
      return;
    }
    const rect = element.getBoundingClientRect();
    const dx = Math.max(x - rect.left, 0, x - rect.right);
    const dy = Math.max(y - rect.top, 0, y - rect.bottom);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Update closestElement if this element is closer
    if (distance < minDistance) {
      minDistance = distance;
      closestElement = element;
    }
  });

  return closestElement;
}

function getElementSideForCoordinates(element: HTMLElement, coordinates: Coordinates): Side {
  const rect = element.getBoundingClientRect();
  const { x, y } = coordinates;
  const dx = x - rect.left;
  const dy = y - rect.top;

  const horizontal = dx > rect.width / 2 ? "right" : "left";
  const vertical = dy > rect.height / 2 ? "bottom" : "top";

  return { horizontal, vertical };
}

export function getInsertPosition(params: Params) {
  const { dragElement, coordinates } = params;

  // all elements at the coordinates
  const dropTargets = document.elementsFromPoint(coordinates.x, coordinates.y) as HTMLElement[];
  // filter drop targets and get the one that is the closest to the mouse pointer
  let dropTarget = findClosestElementToCoordinates(coordinates, dropTargets);

  // for images, we want to use the parent element (the <picture>) as the drop target
  if (dropTarget?.nodeName === "IMG") {
    dropTarget = dropTarget.parentElement;
  }

  if (!dropTarget) return null;

  const isContainer = dropTarget.hasAttribute("ep-container");
  // const isContainerChild = dropTarget.closest("[ep-container]") !== null;
  const isContainerChild = dropTarget.parentElement?.hasAttribute("ep-container");

  if (!isContainer && !isContainerChild) {
    return null;
  }

  // initialize reference element with the drop target
  let referenceElement = dropTarget;
  let side: Side = { horizontal: "left", vertical: "top" };

  if (isContainer) {
    // we are dragging over a container
    // we need to know which child element we are dragging over OR which child element is the closest to the mouse pointer
    const children = Array.from(dropTarget.children) as HTMLElement[];
    const closestChild = findClosestElementToCoordinates(coordinates, children);
    if (closestChild) {
      side = getElementSideForCoordinates(closestChild, coordinates);
      // if the closest child is on the right or bottom side of the child, we want to insert after the child
      referenceElement = closestChild;
    } else {
      // container has no children, we want to insert at the beginning of the container
      side = getElementSideForCoordinates(dropTarget, coordinates);
    }
  } else if (isContainerChild) {
    // we are dragging over a child of a container
    // we need to know which side of the child we are dragging over
    side = getElementSideForCoordinates(dropTarget, coordinates);
  }

  const container = (isContainerChild ? referenceElement.parentElement : dropTarget) as HTMLElement;

  // Check if the dragged element can be contained in the container
  if (!canContain(container.tagName.toLowerCase() as Tag, dragElement.tagName.toLowerCase() as Tag)) {
    return null;
  }

  const computedStyle = window.getComputedStyle(container);
  let isContainerHorizontal = false;

  // Check for flex container
  if (computedStyle.display === "flex" || computedStyle.display === "inline-flex") {
    isContainerHorizontal = computedStyle.flexDirection.startsWith("row");
  }
  // Check for grid container
  else if (computedStyle.display === "grid" || computedStyle.display === "inline-grid") {
    const gridAutoFlow = computedStyle.gridAutoFlow;
    isContainerHorizontal = !gridAutoFlow.includes("column"); // 'row', 'dense', or 'row dense' are horizontal
  }
  // For other layouts, check the container's dimensions and childNodes
  else {
    const childNodes = Array.from(container.childNodes).filter(
      (node) => node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).offsetParent !== null,
    ) as HTMLElement[];

    if (childNodes.length > 1) {
      const firstChild = childNodes[0];
      const lastChild = childNodes[childNodes.length - 1];
      const firstChildRect = firstChild.getBoundingClientRect();
      const lastChildRect = lastChild.getBoundingClientRect();

      isContainerHorizontal =
        Math.abs(lastChildRect.left - firstChildRect.left) > Math.abs(lastChildRect.top - firstChildRect.top);
    } else {
      // the container has no children, we need to check its dimensions
      //todo: change this, this is not reliable
      isContainerHorizontal = container.offsetWidth > container.offsetHeight;
    }
  }

  return { container, referenceElement, isContainerHorizontal, side, coordinates };
}

function delayHideIndicator(delay = 400) {
  if (indicatorTimeout) {
    clearTimeout(indicatorTimeout as number);
  }
  indicatorTimeout = setTimeout(() => {
    if (indicator) {
      indicator.style.opacity = "0";
    }
  }, delay);
}

function cancelHideIndicator() {
  if (indicatorTimeout) {
    clearTimeout(indicatorTimeout as number);
  }
}

const INDICATOR_TRANSITION = "all 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.15s ease";
const INDICATOR_TRANSITION_2WAY_1 = "all 0.15s ease-in";
const INDICATOR_TRANSITION_2WAY_2 = "all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1)";

function createIndicator(): HTMLElement {
  const indicator = document.createElement("div");
  indicator.className = "dnd-indicator";

  Object.assign(indicator.style, {
    position: "fixed",
    display: "block",
    pointerEvents: "none",
    backgroundColor: "#8f93d8",
    opacity: "0",
    transition: INDICATOR_TRANSITION,
    zIndex: "1000",
    borderRadius: "9999px",
    transformOrigin: "0 0",
  });
  document.body.appendChild(indicator);
  return indicator;
}

let lastPosition: { width: string; height: string; top: string; left: string; horizontal: boolean } | null =
  null;

function updateIndicator(insertPosition: ReturnType<typeof getInsertPosition>) {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    if (!indicator) {
      indicator = createIndicator();
    }

    if (!insertPosition) {
      delayHideIndicator();
      return;
    }

    const { container, referenceElement, isContainerHorizontal, side, coordinates } = insertPosition;

    const containerRect = container.getBoundingClientRect();
    const containerStyles = window.getComputedStyle(container);
    const contentLeft = containerRect.left;
    const contentTop = containerRect.top + parseFloat(containerStyles.paddingTop);
    const contentRight = containerRect.right;
    const contentBottom = containerRect.bottom - parseFloat(containerStyles.paddingBottom);

    const children = Array.from(container.children) as HTMLElement[];
    children.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      return isContainerHorizontal ? rectA.left - rectB.left : rectA.top - rectB.top;
    });

    let rect: DOMRect;
    if (referenceElement) {
      rect = referenceElement.getBoundingClientRect();
    } else {
      rect = container.getBoundingClientRect();
    }

    const lineWidth = 10;
    let width: string, height: string, top: string, left: string;

    if (isContainerHorizontal) {
      height = `${contentBottom - contentTop}px`;
      top = `${contentTop}px`;
      width = `${lineWidth}px`;

      if (!referenceElement || side.horizontal === "left") {
        const nextElement = referenceElement || children[0];
        const nextRect = nextElement.getBoundingClientRect();
        if (referenceElement.previousElementSibling) {
          const prevRect = referenceElement.previousElementSibling.getBoundingClientRect();
          left = `${(prevRect.right + nextRect.left) / 2}px`;
        } else {
          left = `${(contentLeft + nextRect.left) / 2}px`;
        }
      } else {
        const prevRect = referenceElement.getBoundingClientRect();
        if (referenceElement.nextElementSibling) {
          const nextRect = referenceElement.nextElementSibling.getBoundingClientRect();
          left = `${(prevRect.right + nextRect.left) / 2}px`;
        } else {
          left = `${(prevRect.right + contentRight) / 2}px`;
        }
      }
    } else {
      width = `${contentRight - contentLeft}px`;
      left = `${contentLeft}px`;
      height = `${lineWidth}px`;

      if (!referenceElement || side.vertical === "top") {
        const nextElement = referenceElement || children[0];
        const nextRect = nextElement.getBoundingClientRect();
        if (referenceElement.previousElementSibling) {
          const prevRect = referenceElement.previousElementSibling.getBoundingClientRect();
          top = `${(prevRect.bottom + nextRect.top) / 2}px`;
        } else {
          top = `${(contentTop + nextRect.top) / 2}px`;
        }
      } else {
        const prevRect = referenceElement.getBoundingClientRect();
        if (referenceElement.nextElementSibling) {
          const nextRect = referenceElement.nextElementSibling.getBoundingClientRect();
          top = `${(prevRect.bottom + nextRect.top) / 2}px`;
        } else {
          top = `${(prevRect.bottom + contentBottom) / 2}px`;
        }
      }
    }

    const OPACITY = 0.5;
    const DISTANCE_THRESHOLD = 60;
    let skipUpdate = false;

    if (isContainerHorizontal) {
      const distanceFromLeft = Math.abs(coordinates.x - rect.left);
      const distanceFromRight = Math.abs(coordinates.x - rect.right);
      skipUpdate = Math.min(distanceFromLeft, distanceFromRight) > DISTANCE_THRESHOLD;
    } else {
      const distanceFromTop = Math.abs(coordinates.y - rect.top);
      const distanceFromBottom = Math.abs(coordinates.y - rect.bottom);
      skipUpdate = Math.min(distanceFromTop, distanceFromBottom) > DISTANCE_THRESHOLD;
    }

    if (skipUpdate) {
      // console.log("Indicator too far, skipping update");
      delayHideIndicator();
      return;
    }

    cancelHideIndicator();

    // Check if we're switching orientation
    const isOrientationSwitch = lastPosition && lastPosition.horizontal !== isContainerHorizontal;
    // const isOrientationSwitch = lastPosition && lastPosition.width !== `${lineWidth}px`;

    if (isOrientationSwitch) {
      // First, transition to a small square
      Object.assign(indicator.style, {
        transition: INDICATOR_TRANSITION_2WAY_1,
        width: `${lineWidth}px`,
        height: `${lineWidth}px`,
        top: lastPosition!.top,
        left: lastPosition!.left,
        opacity: OPACITY.toString(),
      });

      // Then, after a short delay, transition to the new position and size
      setTimeout(() => {
        Object.assign(indicator!.style, {
          transition: INDICATOR_TRANSITION_2WAY_2,
          width,
          height,
          top,
          left,
        });
      }, 150);
    } else {
      // If we're not switching orientation, just update normally
      Object.assign(indicator.style, {
        transition: INDICATOR_TRANSITION,
        width,
        height,
        top,
        left,
        opacity: OPACITY.toString(),
        display: "block",
      });
    }

    lastPosition = { width, height, top, left, horizontal: isContainerHorizontal };
    rafId = null;
  });
}

export function onDragOver(dragElement: HTMLElement, coordinates: Coordinates): void {
  const insertPosition = getInsertPosition({ dragElement, coordinates });
  updateIndicator(insertPosition);
}

export function onDragEnd(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (indicator) {
    // indicator.style.display = "none";
    indicator.remove();
    indicator = null;
  }

  indicatorTimeout = null;
}
// Call this function once to create the indicator
function initializeDragAndDrop() {
  createIndicator();
}

// Call this function when your app initializes
initializeDragAndDrop();
