import { LAYOUT_COLS } from "../layout-constants";
import type { Brick } from "../bricks";
import type { ResponsiveMode } from "../responsive";
import type { BrickConstraints } from "../brick-manifest";

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

/**
 * Adjust the bricks "mobile" position based on the "desktop" position by:
 * - Setting each brick to 100% width
 * - Guess the order based on the desktop position
 * - Respecting the optional "manualHeight" that could be already set on the brick's mobile position
 * - Add a blank row between each brick
 */
export function adjustMobileLayout(layout: Brick[]): Brick[] {
  // Sort bricks by desktop position (top to bottom, left to right)
  const sortedBricks = [...layout].sort((a, b) => {
    const posA = a.position.desktop;
    const posB = b.position.desktop;
    if (posA.y === posB.y) return posA.x - posB.x;
    return posA.y - posB.y;
  });

  let currentY = 0;
  const spacing = 1; // Add 1 unit spacing between bricks

  return sortedBricks.map((brick) => {
    const newBrick = { ...brick };
    const mobilePosition = brick.position.mobile;

    // Set new mobile position
    newBrick.position = {
      ...brick.position,
      mobile: {
        ...mobilePosition,
        x: 0,
        y: currentY,
        w: LAYOUT_COLS.mobile,
        h: mobilePosition.manualHeight || mobilePosition.h,
      },
    };

    // Update currentY for next brick
    currentY += newBrick.position.mobile.h + spacing;

    return newBrick;
  });
}

export function canDropOnLayout(
  bricks: Brick[],
  currentBp: ResponsiveMode,
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
