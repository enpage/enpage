import { generateId } from "~/browser/bricks/common";
import { type BrickType, manifests } from "~/browser/bricks/all-manifests";
import type { BrickManifest } from "~/browser/bricks/manifest";

export type BrickPosition = {
  /**
   * Unique identifier for the brick for react-grid-layout.
   */
  i?: string;
  /**
   * Col start (0-based) in grid units, not pixels.
   */
  x: number;
  /**
   * Row start (0-based) in grid units, not pixels.
   */
  y: number;

  /**
   * Width in columns in grid units, not pixels.
   */
  w: number;

  /**
   * Height in rows in grid units, not pixels.
   */
  h: number;

  /**
   * Minimum width in columns in grid units, not pixels.
   */
  minW?: number;
  /**
   * Minimum height in rows in grid units, not pixels.
   */
  minH?: number;

  /**
   * Maximum width in columns in grid units, not pixels.
   */
  maxW?: number;

  /**
   * Maximum height in rows in grid units, not pixels.
   */
  maxH?: number;

  /**
   * If true, the brick won't be displayed.
   */
  hidden?: boolean;
};

// Helper type to ensure at least one breakpoint is set
type RequireAtLeastOne<T> = {
  [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: T[P] };
}[keyof T];

export type Brick<T extends string = string> = {
  type: T;
  id: string;
  props: Record<string, unknown>;
  position: RequireAtLeastOne<{
    mobile: BrickPosition;
    tablet: BrickPosition;
    desktop: BrickPosition;
  }>;
  // manifest: BrickManifest;
};

// type DefinedBrick = Omit<Brick, "id" | "manifest"> & {
//   manifest?: BrickManifest;
// };
export type DefinedBrick = Omit<Brick, "id">;

export function defineBricks<B extends DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map((brick) => ({
    ...brick,
    id: `brick-${generateId()}`,
    // manifest: manifests[brick.type as BrickType],
  }));
}

/**
 * This specific type is used to define a row of bricks.
 * The `y` property of the position is automatically set to the current row.
 */
type DefinedRowBrick = Omit<Brick, "id" | "manifest" | "position"> & {
  // manifest?: BrickManifest;
  position: RequireAtLeastOne<{
    mobile: Omit<BrickPosition, "y">;
    tablet: Omit<BrickPosition, "y">;
    desktop: Omit<BrickPosition, "y">;
  }>;
};

// Helpers to generate bricks coordonates
const currentRowByBreakpoint: Record<"mobile" | "tablet" | "desktop", number> = {
  mobile: 0,
  tablet: 0,
  desktop: 0,
};

/**
 * Creates a new row of bricks, automatically setting the `y` property to the current row.
 */
export function createRow<B extends DefinedRowBrick[]>(bricks: B): DefinedBrick[] {
  // Get the max height of the bricks passed
  const maxDesktopHeight = Math.max(
    ...bricks.map((brick) =>
      Math.max(brick.position.desktop?.h ?? 0, brick.position.tablet?.h ?? 0, brick.position.mobile?.h ?? 0),
    ),
  );
  const maxTabletHeight = Math.max(
    ...bricks.map((brick) =>
      Math.max(brick.position.tablet?.h ?? 0, brick.position.mobile?.h ?? 0, brick.position.desktop?.h ?? 0),
    ),
  );
  const maxMobileHeight = Math.max(
    ...bricks.map((brick) =>
      Math.max(brick.position.mobile?.h ?? 0, brick.position.tablet?.h ?? 0, brick.position.desktop?.h ?? 0),
    ),
  );

  // create the row
  const created = bricks.map((brick, index) => {
    const adjusted = {
      ...brick,
      id: `brick-${generateId()}`,
      position: {
        ...(brick.position.mobile
          ? {
              mobile: {
                ...brick.position.mobile,
                y: currentRowByBreakpoint.mobile,
              },
            }
          : {}),
        ...(brick.position.tablet
          ? {
              tablet: {
                ...brick.position.tablet,
                y: currentRowByBreakpoint.tablet,
              },
            }
          : {}),
        ...(brick.position.desktop
          ? {
              desktop: {
                ...brick.position.desktop,
                y: currentRowByBreakpoint.desktop,
              },
            }
          : {}),
      },
    };
    if (adjusted.position.mobile?.w === 12 && index !== bricks.length - 1) {
      currentRowByBreakpoint.mobile += adjusted.position.mobile.h;
    }
    return adjusted;
  });

  // increment the current row
  currentRowByBreakpoint.desktop += maxDesktopHeight;
  currentRowByBreakpoint.tablet += maxTabletHeight;
  currentRowByBreakpoint.mobile += maxMobileHeight;

  // return teh created bricks
  return created as DefinedBrick[];
}
