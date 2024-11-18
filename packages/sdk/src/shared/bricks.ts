import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

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
};

export type BricksLayout = Brick[];
export type ResponsivePosition = Brick["position"];
export type Breakpoint = keyof Brick["position"];

export type DefinedBrick = Omit<Brick, "id" | "position" | "manifest"> & {
  position: {
    mobile: DefinedBrickPosition;
    desktop: DefinedBrickPosition;
  };
};

export type LayoutCols = {
  mobile: number;
  desktop: number;
};

// function mapConstraints(
//   manifest: ResolvedBrickManifest,
//   mode: "desktop" | "mobile",
//   cols: LayoutCols = LAYOUT_COLS,
// ): BrickConstraints {
//   return {
//     preferredWidth: manifest.preferredWidth,
//     preferredHeight: manifest.preferredHeight,
//     minWidth: manifest.minWidth,
//     minHeight: manifest.minHeight,
//     maxWidth: manifest.maxWidth,
//     maxHeight: manifest.maxHeight,
//   };
// }

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
      },
    };

    if (adjusted.position.mobile?.w === LAYOUT_COLS.mobile && index !== bricks.length - 1) {
      currentRowByBreakpoint.mobile += adjusted.position.mobile.h;
    }

    return adjusted;
  });

  // increment the current row
  currentRowByBreakpoint.desktop += maxDesktopHeight;
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
  preferredWidth,
  preferredHeight,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
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
  minWidth?: {
    mobile: number;
    desktop: number;
  };
  minHeight?: {
    mobile: number;
    desktop: number;
  };
  maxWidth?: {
    mobile: number;
    desktop: number;
  };
  maxHeight?: {
    mobile: number;
    desktop: number;
  };
  preferredWidth?: {
    mobile: number;
    desktop: number;
  };
  preferredHeight?: {
    mobile: number;
    desktop: number;
  };
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
    preferredWidth: Type.Object({
      mobile: Type.Number({ default: preferredWidth ?? minWidth ?? 1 }),
      desktop: Type.Number({ default: preferredWidth ?? minWidth ?? 1 }),
    }),
    preferredHeight: Type.Object({
      mobile: Type.Number({ default: preferredHeight ?? minHeight ?? 1 }),
      desktop: Type.Number({ default: preferredHeight ?? minHeight ?? 1 }),
    }),
    // preferredHeight: Type.Number({ default: preferredHeight ?? minHeight ?? 1 }),
    minWidth: Type.Object({
      mobile: Type.Number({ default: minWidth ?? 1 }),
      desktop: Type.Number({ default: minWidth ?? 1 }),
    }),
    maxWidth: Type.Object({
      mobile: Type.Number({ default: maxWidth ?? LAYOUT_COLS.mobile }),
      desktop: Type.Number({ default: maxWidth ?? LAYOUT_COLS.desktop }),
    }),
    minHeight: Type.Object({
      mobile: Type.Number({ default: minHeight ?? 1 }),
      desktop: Type.Number({ default: minHeight ?? 1 }),
    }),

    ...(datasource && { datasource }),
    ...(datarecord && { datarecord }),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;
export type BrickConstraints = Pick<
  ResolvedBrickManifest,
  "preferredWidth" | "preferredHeight" | "minWidth" | "minHeight" | "maxWidth"
>;
