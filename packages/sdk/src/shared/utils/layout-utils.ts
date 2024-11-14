import type { Layout } from "react-grid-layout";
import { LAYOUT_COLS } from "../layout-constants";

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
  function isPositionValid(
    layouts: Layout[],
    breakpoint: "mobile" | "desktop",
    x: number,
    y: number,
    width: number,
    height: number,
  ): boolean {
    // Check if position is within grid bounds
    if (x < 0 || x + width > LAYOUT_COLS[breakpoint] || y < 0) return false;

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
    breakpoint: "mobile" | "desktop",
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
        w: Math.min(constraints.preferredW || effectiveMinWidth, LAYOUT_COLS[breakpoint]),
        h: constraints.preferredH ?? 1,
      };
    }

    // Create a height map to track the highest point at each column
    const heightMap = new Array(LAYOUT_COLS[breakpoint]).fill(0);

    // Fill height map based on existing layouts
    layouts.forEach((layout) => {
      for (let col = layout.x; col < layout.x + layout.w; col++) {
        heightMap[col] = Math.max(heightMap[col], layout.y + layout.h);
      }
    });

    // Calculate maximum possible width based on preferred width and breakpoint constraints
    const maxPossibleWidth = Math.min(
      constraints.preferredW || LAYOUT_COLS[breakpoint],
      LAYOUT_COLS[breakpoint],
    );

    // Try different widths, starting from preferred/maximum down to minimum
    for (let width = maxPossibleWidth; width >= effectiveMinWidth; width--) {
      // Try each possible x position
      for (let x = 0; x <= LAYOUT_COLS[breakpoint] - width; x++) {
        // Find the maximum height at this x position for the current width
        const relevantHeights = heightMap.slice(x, x + width);
        const y = Math.max(...relevantHeights);

        // Check if this position is valid
        if (
          isPositionValid(
            layouts,
            breakpoint,
            x,
            y,
            width,
            constraints.preferredW ?? defaultsPreferred[breakpoint].width,
          )
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
      w: Math.min(constraints.preferredW || effectiveMinWidth, LAYOUT_COLS[breakpoint]),
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
