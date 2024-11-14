import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

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

export type DefinedBrickPosition = {
  w: number | "full" | "half" | "third" | "twoThird" | "quarter" | "threeQuarter";
  h: number;
  x: number | "half" | "third" | "twoThird" | "quarter" | "threeQuarter";
  y: number;
  minW?: number | "full" | "half" | "third" | "twoThird" | "quarter" | "threeQuarter";
  minH?: number;
  maxW?: number | "full" | "half" | "third" | "twoThird" | "quarter" | "threeQuarter";
  maxH?: number;
  hidden?: boolean;
};

export type Brick<T extends string = string> = {
  type: T;
  id: string;
  props: Record<string, unknown>;
  position: {
    mobile: BrickPosition;
    desktop: BrickPosition;
  };
  // manifest: BrickManifest;
};

export type BricksLayout = Brick[];
export type ResponsivePosition = Brick["position"];
export type Breakpoint = keyof Brick["position"];

// type DefinedBrick = Omit<Brick, "id" | "manifest"> & {
//   manifest?: BrickManifest;
// };
export type DefinedBrick = Omit<Brick, "id" | "position"> & {
  position: {
    mobile: DefinedBrickPosition;
    desktop: DefinedBrickPosition;
  };
};

export type LayoutCols = {
  mobile: number;
  desktop: number;
};

function mapPosition(
  position: DefinedBrickPosition,
  mode: "desktop" | "mobile",
  cols: LayoutCols = LAYOUT_COLS,
): BrickPosition {
  return {
    x:
      position.x === "quarter"
        ? cols[mode] / 4
        : position.x === "threeQuarter"
          ? cols[mode] * 0.75
          : position.x === "half"
            ? cols[mode] / 2
            : position.x === "third"
              ? cols[mode] / 3
              : position.x === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.x,
    y: position.y,
    w:
      position.w === "full"
        ? cols[mode]
        : position.w === "half"
          ? cols[mode] / 2
          : position.w === "third"
            ? cols[mode] / 3
            : position.w === "quarter"
              ? cols[mode] / 4
              : position.w === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.w === "threeQuarter"
                  ? (cols[mode] * 3) / 4
                  : position.w,
    h: position.h,
    minW:
      position.minW === "full"
        ? cols[mode]
        : position.minW === "half"
          ? cols[mode] / 2
          : position.minW === "third"
            ? cols[mode] / 3
            : position.minW === "quarter"
              ? cols[mode] / 4
              : position.minW === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.minW === "threeQuarter"
                  ? (cols[mode] * 3) / 4
                  : position.minW,
    minH: position.minH,
    maxW:
      position.maxW === "full"
        ? cols[mode]
        : position.maxW === "half"
          ? cols[mode] / 2
          : position.maxW === "third"
            ? cols[mode] / 3
            : position.maxW === "quarter"
              ? cols[mode] / 4
              : position.maxW === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.maxW === "threeQuarter"
                  ? (cols[mode] * 3) / 4
                  : position.maxW,
    maxH: position.maxH,
    hidden: position.hidden,
  };
}

export function defineBricks<B extends DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map((brick) => ({
    ...brick,
    id: `brick-${generateId()}`,
    position: {
      mobile: mapPosition(brick.position.mobile, "mobile"),
      desktop: mapPosition(brick.position.desktop, "desktop"),
    },
  }));
}

/**
 * This specific type is used to define a row of bricks.
 * The `y` property of the position is automatically set to the current row.
 */
type DefinedRowBrick = Omit<Brick, "id" | "manifest" | "position"> & {
  // manifest?: BrickManifest;
  position: {
    mobile?: Omit<DefinedBrickPosition, "y">;
    tablet?: Omit<DefinedBrickPosition, "y">;
    desktop: Omit<DefinedBrickPosition, "y">;
  };
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
        desktop: {
          ...brick.position.desktop,
          y: currentRowByBreakpoint.desktop,
        },
        ...(brick.position.mobile
          ? {
              mobile: {
                ...brick.position.mobile,
                y: currentRowByBreakpoint.mobile,
              },
            }
          : null),
        ...(brick.position.tablet
          ? {
              tablet: {
                ...brick.position.tablet,
                y: currentRowByBreakpoint.tablet,
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

  // return the created bricks
  return created as DefinedBrick[];
}

export function defineBrickManifest<
  BType extends string,
  BTitle extends string,
  BIcon extends string,
  BFile extends string,
  BDesc extends string,
  BProps extends TProperties,
>({
  type,
  kind,
  title,
  description,
  preferredW,
  preferredH,
  minWidth,
  minHeight,
  icon,
  file,
  props,
  datasource,
  datarecord,
}: {
  type: BType;
  kind: string;
  title: BTitle;
  icon: BIcon;
  file: BFile;
  description: BDesc;
  minWidth?: number;
  minHeight?: number;
  preferredW?: number;
  preferredH?: number;
  props: TObject<BProps>;
  datasource?: TObject;
  datarecord?: TObject;
}) {
  return Type.Object({
    type: Type.Literal(type),
    kind: Type.Literal(kind),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    file: Type.Literal(file),
    preferredW: Type.Number({ default: preferredW ?? minWidth ?? 1 }),
    preferredH: Type.Number({ default: preferredH ?? minHeight ?? 1 }),
    minWidth: Type.Number({ default: minWidth ?? 1 }),
    minHeight: Type.Number({ default: minHeight ?? 1 }),
    ...(datasource && { datasource }),
    ...(datarecord && { datarecord }),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;
