import { LAYOUT_COLS } from "../layout-constants";
import type { Breakpoint, Brick, BrickConstraints } from "../bricks";

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

export function canDropOnLayout(
  bricks: Brick[],
  currentBp: Breakpoint,
  dropPosition: { y: number; x: number },
  constraints: BrickConstraints,
): { y: number; x: number; w: number; h: number } | false {
  // Helper function to check if a position is valid
  function isPositionValid(
    existingBricks: Brick[],
    x: number,
    y: number,
    width: number,
    height: number,
  ): boolean {
    // Check if position is within grid bounds
    if (x < 0 || x + width > LAYOUT_COLS[currentBp] || y < 0) return false;

    // Check for collisions with existing bricks
    return !existingBricks.some((brick) => {
      const brickPos = brick.position[currentBp];
      const horizontalOverlap = x < brickPos.x + brickPos.w && x + width > brickPos.x;
      const verticalOverlap = y < brickPos.y + brickPos.h && y + height > brickPos.y;
      return horizontalOverlap && verticalOverlap;
    });
  }

  const config = breakpointConfig[currentBp];

  // Ensure minimum width respects breakpoint constraints
  const effectiveMinWidth = Math.max(constraints.minWidth[currentBp], config.minColSpan);

  // Calculate the width to use - try preferred first, fall back to minimum
  const width = Math.min(constraints.preferredWidth[currentBp] || effectiveMinWidth, LAYOUT_COLS[currentBp]);

  // Calculate the height to use
  const height = constraints.preferredHeight[currentBp] || defaultsPreferred[currentBp].height;

  // Check if the drop position is valid
  if (isPositionValid(bricks, dropPosition.x, dropPosition.y, width, height)) {
    return {
      x: dropPosition.x,
      y: dropPosition.y,
      w: width,
      h: height,
    };
  }

  // If the position is invalid, return false
  return false;
}
