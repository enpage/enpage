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

function getInsertPosition(params: Params) {
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
  const isContainerChild = dropTarget.closest("[ep-container]") !== null;
  // const isContainerChild = dropTarget.parentElement?.hasAttribute("ep-container");

  if (!isContainer && !isContainerChild) {
    console.warn("No valid container found for element %o", dropTarget);
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
      console.log("using closest child the reference element, with side = %o", side);
    } else {
      // container has no children, we want to insert at the beginning of the container
      side = getElementSideForCoordinates(dropTarget, coordinates);
    }
  } else if (isContainerChild) {
    // we are dragging over a child of a container
    // we need to know which side of the child we are dragging over
    side = getElementSideForCoordinates(dropTarget, coordinates);
    console.log("using container child as reference element, with side = %o", side);
  }

  // let container = (isContainerChild ? dropTarget.parentElement : dropTarget) as HTMLElement;
  const container = (isContainerChild ? referenceElement.parentElement : dropTarget) as HTMLElement;

  console.log("--");
  console.log("container: %o", container);
  console.log("referenceElement: %o", referenceElement);
  console.log("isContainer: %o", isContainer);
  console.log("isContainerChild: %o", isContainerChild);
  console.log("side: %o", side);
  console.log("--");

  // Check if the dragged element can be contained in the container
  if (!canContain(container.tagName.toLowerCase() as Tag, dragElement.tagName.toLowerCase() as Tag)) {
    console.warn("Dragged element cannot be contained in this container");
    return null;
  }

  const computedStyle = window.getComputedStyle(container);
  let isContainerHorizontal = false;

  // Check for flex container
  if (computedStyle.display === "flex" || computedStyle.display === "inline-flex") {
    isContainerHorizontal = computedStyle.flexDirection.startsWith("row");
    console.log("Flex/Block container horizontal:", isContainerHorizontal);
  }
  // Check for grid container
  else if (computedStyle.display === "grid" || computedStyle.display === "inline-grid") {
    const gridAutoFlow = computedStyle.gridAutoFlow;
    isContainerHorizontal = !gridAutoFlow.includes("column"); // 'row', 'dense', or 'row dense' are horizontal
    console.log("grid container horizontal:", isContainerHorizontal);
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
    console.log("unknown container horizontal:", isContainerHorizontal);
  }

  // console.log('Container orientation:', isHorizontal ? 'horizontal' : 'vertical');
  // console.log('Using next sibling:', useNextSibling);

  // console.log('Insert index:', insertIndex);

  return { container, referenceElement, isContainerHorizontal, side, coordinates };
}

function delayHideIndicator(delay = 500) {
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

function createIndicator(): HTMLElement {
  console.log("Creating indicator");
  const indicator = document.createElement("div");
  indicator.className = "dnd-indicator";
  indicator.style.position = "fixed";
  indicator.style.pointerEvents = "none";
  indicator.style.borderStyle = "solid";
  indicator.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  indicator.style.opacity = "0.8";
  indicator.style.borderColor = "#8f93d8";
  indicator.style.borderWidth = "0";
  indicator.style.transition = "top 0.3s ease, left 0.3s ease, opacity 0.15s ease, transform 0.3s ease";
  indicator.style.transformOrigin = "0 0";
  indicator.style.zIndex = "1000";
  document.body.appendChild(indicator);
  return indicator;
}

function updateIndicator(insertPosition: ReturnType<typeof getInsertPosition>) {
  // console.log('Updating indicator with insert position:', insertPosition);
  if (!indicator) {
    indicator = createIndicator();
  }

  if (!insertPosition) {
    // console.log('No valid insert position, hiding indicator');
    // indicator.style.display = "none";
    delayHideIndicator();
    return;
  }

  const { container, referenceElement, isContainerHorizontal, side, coordinates } = insertPosition;

  let rect: DOMRect;
  if (referenceElement) {
    rect = referenceElement.getBoundingClientRect();
  } else {
    console.warn("No reference element, using container");
    rect = container.getBoundingClientRect();
  }

  const lineWidth = 4; // 3px line width
  const spacing = 1; // 2px spacing

  let width: string, height: string, top: string, left: string, right: string, bottom: string;

  if (isContainerHorizontal) {
    // take size.horizontal into account
    width = "0";
    height = `${rect.height + spacing * 2}px`;
    top = `${rect.top - spacing}px`;
    left =
      side.horizontal === "left"
        ? referenceElement
          ? `${rect.left - spacing - lineWidth / 2}px`
          : `${rect.right + spacing - lineWidth / 2}px`
        : "unset";

    right = side.horizontal === "right" ? `${rect.right + spacing - lineWidth / 2}px` : "unset";
    indicator.style.borderLeftWidth = `${lineWidth}px`;
    indicator.style.borderRightWidth = "0";
    indicator.style.borderTopWidth = "0";
    indicator.style.borderBottomWidth = "0";
  } else {
    width = `${rect.width + spacing * 2}px`;
    height = "0";
    top = referenceElement
      ? `${rect.top - spacing - lineWidth / 2}px`
      : `${rect.bottom + spacing - lineWidth / 2}px`;
    left = `${rect.left - spacing}px`;
    right = "unset";
    indicator.style.borderLeftWidth = "0";
    indicator.style.borderRightWidth = "0";
    indicator.style.borderTopWidth = `${lineWidth}px`;
    indicator.style.borderBottomWidth = "0";
  }

  const OPACITY = 0.8;
  // if the indicator line if farer than the coordinates of the mouse (with 30px treshold), skip the update
  const DISTANCE_TRESHOLD = 60;

  if (
    isContainerHorizontal
      ? Math.abs(coordinates.x - rect.left) > DISTANCE_TRESHOLD
      : Math.abs(coordinates.y - rect.top) > DISTANCE_TRESHOLD
  ) {
    // indicator.style.display = "none";
    console.log("Indicator too far, skipping update");
    delayHideIndicator();
    return;
  }

  cancelHideIndicator();

  Object.assign(indicator.style, {
    display: "block",
    width,
    height,
    top,
    left,
    right,
    opacity: OPACITY,
  });
}

export function onDragOver(dragElement: HTMLElement, coordinates: Coordinates): void {
  const insertPosition = getInsertPosition({
    dragElement,
    coordinates,
  });

  updateIndicator(insertPosition);
}

export function onDragEnd(): void {
  if (indicator) {
    indicator.style.display = "none";
  }
}

// Call this function once to create the indicator
function initializeDragAndDrop() {
  createIndicator();
}

// Call this function when your app initializes
initializeDragAndDrop();
