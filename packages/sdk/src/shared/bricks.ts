import { generateId } from "~/browser/bricks/common";
import { type BrickType, manifests } from "~/browser/bricks/all-manifests";
import type { BrickManifest } from "~/browser/bricks/manifest";

export const GRID_COLS = 12;

export type BrickPosition = {
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
   * If true, the brick will not be draggable or resizable.
   */
  static?: boolean;
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
  manifest: BrickManifest;
};

type DefinedBrick = Omit<Brick, "id" | "manifest"> & {
  manifest?: BrickManifest;
};

export function defineBricks<B extends DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map((brick) => ({
    ...brick,
    id: `brick-${generateId()}`,
    manifest: manifests[brick.type as BrickType],
  }));
}
