import { LAYOUT_COLS } from "@upstart.gg/sdk/layout-constants";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
import type { BrickConstraints } from "@upstart.gg/sdk/shared/brick-manifest";

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
  checkCollisions = true,
): { y: number; x: number; w: number; h: number; forbidden?: boolean } | false {
  // Helper function to check if a position is valid
  function isPositionValid(
    existingBricks: Brick[],
    x: number,
    y: number,
    width: number,
    height: number,
  ): boolean {
    // Check if position is within grid bounds
    if (x < 0 || x + width > LAYOUT_COLS[currentBp] || y < 0) {
      console.log("out of bounds, x = %d, y = %d, width = %d, max = %d", x, y, width, LAYOUT_COLS[currentBp]);
      return false;
    }

    if (!checkCollisions) {
      return true;
    }

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

type CollisionSide = "left" | "right" | "top" | "bottom";
type CollisionInfo = { brick: Brick; side: CollisionSide };

type GetDropOverGhostPositionParams = {
  /**
   * The current brick being dragged
   */
  brick: Brick;
  /**
   * The list of all bricks in the layout
   */
  bricks: Brick[];
  /**
   * The current breakpoint ("mobile" | "desktop")
   */
  currentBp: ResponsiveMode;
  /**
   * The drop position (column-based)
   */
  dropPosition: { y: number; x: number };
};

// function detectCollisionSides(
//   draggedRect: { x: number; y: number; w: number; h: number },
//   brickOnLayout: { x: number; y: number; w: number; h: number },
// ): CollisionSide[] {
//   const sides: CollisionSide[] = [];
//   const tolerance = 1; // Adjust as needed

//   if (Math.abs(draggedRect.x - (brickOnLayout.x + brickOnLayout.w)) <= tolerance) sides.push("left");
//   if (Math.abs(draggedRect.x + draggedRect.w - brickOnLayout.x) <= tolerance) sides.push("right");
//   if (Math.abs(draggedRect.y - (brickOnLayout.y + brickOnLayout.h)) <= tolerance) sides.push("top");
//   if (Math.abs(draggedRect.y + draggedRect.h - brickOnLayout.y) <= tolerance) sides.push("bottom");

//   console.log("detecting colisions between %o and %o gives %o", draggedRect, brickOnLayout, sides);

//   return sides;
// }
function detectCollisionSides(
  draggedRect: { x: number; y: number; w: number; h: number },
  brickOnLayout: { x: number; y: number; w: number; h: number },
): CollisionSide | null {
  if (
    !(
      draggedRect.x < brickOnLayout.x + brickOnLayout.w &&
      draggedRect.x + draggedRect.w > brickOnLayout.x &&
      draggedRect.y < brickOnLayout.y + brickOnLayout.h &&
      draggedRect.y + draggedRect.h > brickOnLayout.y
    )
  ) {
    return null;
  }

  // Calculate overlap amounts on each side
  const overlaps = {
    top: Math.abs(draggedRect.y + draggedRect.h - brickOnLayout.y),
    bottom: Math.abs(draggedRect.y - (brickOnLayout.y + brickOnLayout.h)),
    left: Math.abs(draggedRect.x + draggedRect.w - brickOnLayout.x),
    right: Math.abs(draggedRect.x - (brickOnLayout.x + brickOnLayout.w)),
  };

  // Return the side with smallest overlap (closest to edge)
  return (
    Object.entries(overlaps).reduce(
      (min, [side, overlap]) =>
        !min || overlap < min.overlap ? { side: side as CollisionSide, overlap } : min,
      null as { side: CollisionSide; overlap: number } | null,
    )?.side || null
  );
}

// Helper function to check if a position is valid
function canTakeFullSpace(
  currentBp: ResponsiveMode,
  brick: Brick,
  existingBricks: Brick[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  // Check if position is within grid bounds
  if (x < 0 || x + width > LAYOUT_COLS[currentBp] || y < 0) {
    return false;
  }

  // Check for collisions with existing bricks
  return !existingBricks.some((brickObj) => {
    const brickPos = brickObj.position[currentBp];
    const horizontalOverlap = x < brickPos.x + brickPos.w && x + width > brickPos.x;
    const verticalOverlap = y < brickPos.y + brickPos.h && y + height > brickPos.y;
    return (
      horizontalOverlap &&
      verticalOverlap &&
      // Don't consider the brick itself
      brickObj.id !== brick.id
    );
  });
}

export function getDropOverGhostPosition({
  brick,
  bricks,
  currentBp,
  dropPosition,
}: GetDropOverGhostPositionParams) {
  const draggedRect = {
    x: dropPosition.x,
    y: dropPosition.y,
    w: brick.position[currentBp].w,
    h: brick.position[currentBp].h,
  };

  let closestCollision: { brick: Brick; side: CollisionSide; distance: number } | null = null;

  bricks.forEach((b) => {
    if (b.id === brick.id) return;

    const side = detectCollisionSides(draggedRect, b.position[currentBp]);
    if (!side) return;

    const distance = Math.min(
      Math.abs(draggedRect.x - b.position[currentBp].x),
      Math.abs(draggedRect.y - b.position[currentBp].y),
    );

    if (!closestCollision || distance < closestCollision.distance) {
      closestCollision = { brick: b, side, distance };
    }
  });

  // There is a collision, mark it as forbidden
  const forbidden =
    canTakeFullSpace(
      currentBp,
      brick,
      bricks,
      dropPosition.x,
      dropPosition.y,
      brick.position[currentBp].w,
      brick.position[currentBp].h,
    ) === false;

  // return the ghost brick position
  return {
    ...draggedRect,
    forbidden,
    collision: closestCollision,
  };
}
