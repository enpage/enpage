import type { Layout } from "react-grid-layout";

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
  tablet: Layout[];
  desktop: Layout[];
}

// Column breakdowns for responsive behavior
const breakpointConfig = {
  mobile: {
    columnRatio: 1, // Each column is 1 unit (12 smaller columns)
    minColSpan: 3, // Minimum 3 columns on mobile (1/4 width)
  },
  tablet: {
    columnRatio: 1, // Each column is 1 unit (12 medium columns)
    minColSpan: 4, // Minimum 4 columns on tablet (1/3 width)
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
  tablet: {
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
    breakpoint: "mobile" | "tablet" | "desktop",
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
    tablet: findFirstAvailable(
      currentLayouts.tablet,
      "tablet",
      constraints.preferredW || defaultsPreferred.tablet.width,
    ),
    desktop: findFirstAvailable(
      currentLayouts.desktop,
      "desktop",
      constraints.preferredW || defaultsPreferred.desktop.width,
    ),
  };
}

// // Example usage
// const sampleLayouts = {
//   mobile: [
//     { i: "block1", x: 0, y: 0, w: 12, h: 2 }, // Full width on mobile
//     { i: "block2", x: 0, y: 2, w: 6, h: 1 }, // Half width on mobile
//   ],
//   tablet: [
//     { i: "block1", x: 0, y: 0, w: 8, h: 2 }, // 2/3 width on tablet
//     { i: "block2", x: 8, y: 0, w: 4, h: 1 }, // 1/3 width on tablet
//   ],
//   desktop: [
//     { i: "block1", x: 0, y: 0, w: 6, h: 2 }, // Half width on desktop
//     { i: "block2", x: 6, y: 0, w: 6, h: 1 }, // Half width on desktop
//   ],
// };

// // Get position for a new block with minimum dimensions
// const newBlockPosition = findOptimalPosition(sampleLayouts, {
//   minW: 3, // Minimum 3 columns
//   minH: 1, // Minimum 1 row
//   preferredW: 6, // Preferred half-width
//   preferredH: 2, // Preferred 2 rows height
// });
