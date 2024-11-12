import type { Breakpoint, Brick, BrickPosition } from "@enpage/sdk/shared/bricks";
import type { Layout } from "react-grid-layout";
import { LAYOUT_ROW_HEIGHT } from "~/config/layout-constants";

const TOTAL_COLS = 12;

// // Types for TypeScript (optional)
// interface Layout {
//   i: string; // unique identifier
//   x: number; // x position
//   y: number; // y position
//   w: number; // width
//   h: number; // height
// }

type BlockConstraints = {
  preferredW?: number; // preferred width if space allows
  preferredH?: number; // preferred height if space allows
};

interface BreakpointLayouts {
  mobile: Layout[];
  desktop: Layout[];
}

// Column breakdowns for responsive behavior
const breakpointConfig = {
  mobile: {
    columnRatio: 1, // Each column is 1 unit (12 smaller columns)
    minColSpan: 3, // Minimum 3 columns on mobile (1/4 width)
  },
  desktop: {
    columnRatio: 1, // Each column is 1 unit (12 large columns)
    minColSpan: 3, // Minimum 3 columns on desktop (1/4 width)
  },
};

const defaultsPreferred = {
  mobile: {
    width: 6,
    height: 3,
  },
  desktop: {
    width: 6,
    height: 3,
  },
};

export function findOptimalPosition(currentLayouts: BreakpointLayouts, constraints: BlockConstraints) {
  // Helper function to check if a position is valid
  function isPositionValid(layouts: Layout[], x: number, y: number, width: number, height: number): boolean {
    // Check if position is within grid bounds
    if (x < 0 || x + width > TOTAL_COLS || y < 0) return false;

    // Check for collisions with existing layouts
    return !layouts.some((layout) => {
      const horizontalOverlap = x < layout.x + layout.w && x + width > layout.x;
      const verticalOverlap = y < layout.y + layout.h && y + height > layout.y;
      return horizontalOverlap && verticalOverlap;
    });
  }

  // Helper function to find the first available position in a specific layout
  function findFirstAvailable(
    layouts: Layout[],
    breakpoint: Breakpoint,
    minWidth: number,
  ): { x: number; y: number; w: number; h: number } {
    const config = breakpointConfig[breakpoint];

    // Ensure minimum width respects breakpoint constraints
    const effectiveMinWidth = Math.max(minWidth, config.minColSpan);

    // If no layouts exist, place at the beginning
    if (!layouts.length) {
      return {
        x: 0,
        y: 0,
        w: Math.min(constraints.preferredW || effectiveMinWidth, TOTAL_COLS),
        h: constraints.preferredH ?? 1,
      };
    }

    // Create a height map to track the highest point at each column
    const heightMap = new Array(TOTAL_COLS).fill(0);

    // Fill height map based on existing layouts
    layouts.forEach((layout) => {
      for (let col = layout.x; col < layout.x + layout.w; col++) {
        heightMap[col] = Math.max(heightMap[col], layout.y + layout.h);
      }
    });

    // Calculate maximum possible width based on preferred width and breakpoint constraints
    const maxPossibleWidth = Math.min(constraints.preferredW || TOTAL_COLS, TOTAL_COLS);

    // Try different widths, starting from preferred/maximum down to minimum
    for (let width = maxPossibleWidth; width >= effectiveMinWidth; width--) {
      // Try each possible x position
      for (let x = 0; x <= TOTAL_COLS - width; x++) {
        // Find the maximum height at this x position for the current width
        const relevantHeights = heightMap.slice(x, x + width);
        const y = Math.max(...relevantHeights);

        // Check if this position is valid
        if (
          isPositionValid(layouts, x, y, width, constraints.preferredW ?? defaultsPreferred[breakpoint].width)
        ) {
          return {
            x,
            y,
            w: width,
            h: constraints.preferredH || defaultsPreferred[breakpoint].height,
          };
        }
      }
    }

    // If no gaps found, place at the bottom
    const y = Math.max(...heightMap);
    return {
      x: 0,
      y,
      w: Math.min(constraints.preferredW || effectiveMinWidth, TOTAL_COLS),
      h: constraints.preferredH || 6,
    };
  }

  // Calculate positions for each breakpoint
  return {
    mobile: findFirstAvailable(
      currentLayouts.mobile,
      "mobile",
      constraints.preferredW || defaultsPreferred.mobile.width,
    ),
    desktop: findFirstAvailable(
      currentLayouts.desktop,
      "desktop",
      constraints.preferredW || defaultsPreferred.desktop.width,
    ),
  };
}

/**
 * Given a desktop layout, convert it to the optimal mobile layout.
 * The main difference between desktop and mobile layouts is the minimum span of elements.
 * Usually, elements are wider on desktop and narrower on mobile.
 * Both layouts are based on a 12-column grid system. But on mobile, the minimum column span should be 4.
 */
export function convertDesktopLayoutToMobile(desktopLayout: Layout[], layoutCols = 12): Layout[] {
  // Sort items by their vertical position first, then horizontal
  const sortedItems = [...desktopLayout].sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });

  const mobileLayout: Layout[] = [];
  let currentY = 0;

  for (const item of sortedItems) {
    // Calculate width changes
    const proportion = item.w / layoutCols;
    let mobileW = Math.round(proportion * layoutCols);

    // Ensure minimum width of 4 columns
    mobileW = Math.max(4, mobileW);
    // Ensure width doesn't exceed 12 columns
    mobileW = Math.min(layoutCols, mobileW);

    // Items that span most of desktop width should span full width
    if (proportion > 0.7) {
      mobileW = layoutCols;
    }

    // Calculate x position (center items that don't take full width)
    const mobileX = mobileW < layoutCols ? Math.floor((layoutCols - mobileW) / 2) : 0;

    // Calculate height adjustment based on width change
    // If element becomes wider, it should become shorter (and vice versa)
    const widthRatio = item.w / mobileW;
    let mobileH = Math.round(item.h * widthRatio);

    // Ensure minimum height of 1 unit
    mobileH = Math.max(1, mobileH);

    // Special cases for height adjustment:
    // 1. Don't adjust height for full-width elements that were already near full-width
    if (item.w >= layoutCols * 0.7 && mobileW === layoutCols) {
      mobileH = item.h;
    }

    // 2. Minimum height for elements that become significantly wider
    if (mobileW > item.w * 1.5) {
      mobileH = Math.max(mobileH, 2);
    }

    // 3. Maximum height for very tall elements
    const maxHeight = 6; // Arbitrary maximum height
    mobileH = Math.min(mobileH, maxHeight);

    mobileLayout.push({
      ...item,
      x: mobileX,
      y: currentY,
      w: mobileW,
      h: mobileH,
    });

    // Update currentY for next item
    currentY += mobileH;
  }

  return mobileLayout;
}

export const adjustLayout = (layout: Layout[], breakpoint: Breakpoint): Layout[] => {
  // Deep clone the layout to avoid mutating the original
  const newLayout: Layout[] = JSON.parse(JSON.stringify(layout));

  // Ensure minimum dimensions are respected
  newLayout.forEach((item) => {
    item.w = Math.max(item.w, item.minW || 1);
    item.h = Math.max(item.h, item.minH || 1);
  });

  // Sort items by their y position, then x position
  newLayout.sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });

  const isOverlapping = (item1: Layout, item2: Layout): boolean => {
    return !(
      item1.x + item1.w <= item2.x ||
      item2.x + item2.w <= item1.x ||
      item1.y + item1.h <= item2.y ||
      item2.y + item2.h <= item1.y
    );
  };

  const findNextAvailablePosition = (
    item: Layout,
    placedItems: Layout[],
    isMobile: boolean,
  ): BrickPosition => {
    let currentX: number = item.x;
    let currentY: number = item.y;
    let found = false;

    // Ensure starting position respects minimum dimensions
    const effectiveWidth: number = Math.max(item.w, item.minW || 1);
    const effectiveHeight: number = Math.max(item.h, item.minH || 1);

    while (!found) {
      let hasOverlap = false;

      // Check if the item would exceed grid boundaries (assuming 12-column grid)
      if (currentX + effectiveWidth > 12) {
        currentX = 0;
        currentY = isMobile ? currentY : currentY + 1;
      }

      for (const placedItem of placedItems) {
        const testItem: Layout = {
          ...item,
          x: currentX,
          y: currentY,
          w: effectiveWidth,
          h: effectiveHeight,
        };

        if (isOverlapping(testItem, placedItem)) {
          hasOverlap = true;
          if (isMobile) {
            // On mobile, prioritize vertical stacking
            currentY = placedItem.y + placedItem.h;
            currentX = 0; // Reset X to start of row
          } else {
            // On desktop, prioritize horizontal placement
            currentX = placedItem.x + placedItem.w;
            // If we reach the container width, move to next row
            if (currentX + effectiveWidth > 12) {
              currentX = 0;
              currentY = placedItem.y + placedItem.h;
            }
          }
          break;
        }
      }

      if (!hasOverlap) {
        found = true;
      }
    }

    return {
      x: currentX,
      y: currentY,
      w: effectiveWidth,
      h: effectiveHeight,
    };
  };

  const adjustedLayout: Layout[] = [];
  const isMobile: boolean = breakpoint === "mobile";

  // Process each item in the layout
  for (const item of newLayout) {
    const newPosition: BrickPosition = findNextAvailablePosition(item, adjustedLayout, isMobile);
    adjustedLayout.push({
      ...item,
      ...newPosition,
    });
  }

  return adjustedLayout;
};

export const adjustLayoutDuringDrag = (
  layout: Layout[],
  draggedItem: Layout,
  breakpoint: Breakpoint,
): Layout[] => {
  // Don't modify the dragged item's position - let it follow the cursor
  const itemsWithoutDragged = layout.filter((item) => item.i !== draggedItem.i);
  const newLayout: Layout[] = [];

  // First, add the dragged item to maintain its current position
  newLayout.push(draggedItem);

  // Sort remaining items based on their distance from the dragged item
  const sortedItems = itemsWithoutDragged.sort((a, b) => {
    const distA = Math.abs(a.x - draggedItem.x) + Math.abs(a.y - draggedItem.y);
    const distB = Math.abs(b.x - draggedItem.x) + Math.abs(b.y - draggedItem.y);
    return distA - distB;
  });

  const isOverlapping = (item1: Layout, item2: Layout): boolean => {
    return !(
      item1.x + item1.w <= item2.x ||
      item2.x + item2.w <= item1.x ||
      item1.y + item1.h <= item2.y ||
      item2.y + item2.h <= item1.y
    );
  };

  // Process each item and shift as needed
  for (const item of sortedItems) {
    if (isOverlapping(item, draggedItem)) {
      // Calculate the best position to move this item
      if (breakpoint === "mobile") {
        // On mobile, prefer vertical movement
        if (draggedItem.y + draggedItem.h > item.y) {
          // Move down
          item.y = draggedItem.y + draggedItem.h;
        } else {
          // Move up
          item.y = Math.max(0, draggedItem.y - item.h);
        }
      } else {
        // On desktop, prefer horizontal movement
        if (draggedItem.x + draggedItem.w > item.x) {
          // Move right
          item.x = draggedItem.x + draggedItem.w;
          if (item.x + item.w > 12) {
            // If would exceed grid width, move to next row
            item.x = 0;
            item.y = draggedItem.y + draggedItem.h;
          }
        } else {
          // Move left
          item.x = Math.max(0, draggedItem.x - item.w);
        }
      }
    }
    newLayout.push(item);
  }

  return newLayout;
};

// Type for the gridItems mapping
interface GridItems {
  [key: string]: HTMLElement;
}

// Utility function to calculate content height including padding
const getContentHeight = (element: HTMLElement | null): number => {
  if (!element) return 0;

  const contentElement = element.querySelector(".brick-content") ?? element;
  console.log("taking content heigh from contentElement", contentElement);
  // Get the actual content height including all children
  const contentHeight = contentElement.getBoundingClientRect().height;

  console.log("rect height", contentHeight);
  console.log("client height", element.clientHeight);
  console.log("scroll height", element.scrollHeight);

  return element.scrollHeight;
};

// Main function to adjust layout based on content
export const adjustLayoutHeight = (layout: Brick[], bp: Breakpoint): Brick[] | false => {
  console.log("adjusting layout height for breakpoint", bp);
  // Convert layout to new array to avoid mutating the original
  const newLayout = layout.map((item) => ({ ...item }));
  let adjusted = false;

  // Iterate through each grid item
  newLayout.forEach((layoutItem) => {
    const gridItem = document.getElementById(layoutItem.id);
    if (!gridItem) {
      console.log("brick %s is missing from the DOM", layoutItem.id);
      return;
    }

    // Get the content wrapper element
    const contentWrapper = gridItem.querySelector(":first-child") as HTMLElement;
    if (!contentWrapper) {
      console.log("brick %s has no content wrapper", layoutItem.id);
      return;
    }

    // Calculate required height in grid units
    const contentHeight = getContentHeight(contentWrapper);
    const requiredRows = Math.ceil(contentHeight / LAYOUT_ROW_HEIGHT);

    // Update height if content overflows, respecting minH and maxH constraints
    if (requiredRows > layoutItem.position[bp].h) {
      console.log(
        "brick %s is overflowing, adjusting height from %d to %d",
        layoutItem.id,
        layoutItem.position[bp].h,
        requiredRows,
      );
      adjusted = true;
      layoutItem.position[bp].h = layoutItem.position[bp].maxH
        ? Math.min(requiredRows, layoutItem.position[bp].maxH)
        : requiredRows;
    }
  });

  // Resolve any collisions after height adjustments
  return resolveCollisions(newLayout, bp, adjusted);
};

// Helper function to resolve layout collisions
const resolveCollisions = (layout: Brick[], bp: Breakpoint, adjusted: boolean): Brick[] | false => {
  const sorted = [...layout].sort((a, b) => a.position[bp].y - b.position[bp].y);

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i].position[bp];

    // Check for collisions with all items below the current one
    for (let j = i + 1; j < sorted.length; j++) {
      const other = sorted[j].position[bp];

      if (doItemsCollide(current, other)) {
        // Move the colliding item down
        other.y = current.y + current.h;
        adjusted = true;
      }
    }
  }

  return adjusted ? sorted : false;
};

// Helper function to check if two items collide
const doItemsCollide = (item1: BrickPosition, item2: BrickPosition): boolean => {
  return !(
    item1.x + item1.w <= item2.x ||
    item1.x >= item2.x + item2.w ||
    item1.y + item1.h <= item2.y ||
    item1.y >= item2.y + item2.h
  );
};
