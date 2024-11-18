import { LAYOUT_COLS } from "../layout-constants";
import type { Breakpoint, Brick, BrickConstraints } from "../bricks";

const defaultsPreferred = {
  mobile: {
    width: LAYOUT_COLS.mobile / 2,
    height: Math.round(LAYOUT_COLS.mobile / 4),
  },
  desktop: {
    width: LAYOUT_COLS.desktop / 3,
    height: LAYOUT_COLS.desktop / 3,
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

  // Ensure minimum width respects breakpoint constraints
  const effectiveMinWidth = Math.max(constraints.minWidth[currentBp], 1);

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
