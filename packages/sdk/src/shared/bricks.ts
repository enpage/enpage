import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";
import type { ResponsiveMode } from "./responsive";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickPositionSchema = Type.Object({
  x: Type.Number({
    title: "X",
    description: "The column start (0-based) in grid units, not pixels.",
  }),
  y: Type.Number({
    title: "Y",
    description: "The row start (0-based) in grid units, not pixels.",
  }),
  w: Type.Number({
    title: "Width",
    description: "The width in columns in grid units, not pixels.",
  }),
  h: Type.Number({
    title: "Height",
    description: "The height in rows in grid units, not pixels.",
  }),
  manualHeight: Type.Optional(
    Type.Number({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type BrickPosition = Static<typeof brickPositionSchema>;

const definedBrickPositionSchema = Type.Object({
  x: Type.Union(
    [
      Type.Number(),
      Type.Literal("half"),
      Type.Literal("third"),
      Type.Literal("twoThird"),
      Type.Literal("quarter"),
      Type.Literal("threeQuarter"),
    ],
    {
      title: "X",
      description:
        "The column start (0-based) in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
    },
  ),
  y: Type.Number({
    title: "Y",
    description: "The row start (0-based) in grid units, not pixels.",
  }),
  w: Type.Union(
    [
      Type.Number(),
      Type.Literal("full"),
      Type.Literal("half"),
      Type.Literal("third"),
      Type.Literal("twoThird"),
      Type.Literal("quarter"),
      Type.Literal("threeQuarter"),
    ],
    {
      title: "Width",
      description:
        "The width in columns in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
    },
  ),
  h: Type.Number({
    title: "Height",
    description: "The height in rows in grid units, not pixels.",
  }),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type DefinedBrickPosition = Static<typeof definedBrickPositionSchema>;

const brickTypeSchema = Type.Union(
  [
    Type.Literal("button"),
    Type.Literal("card"),
    Type.Literal("carousel"),
    Type.Literal("countdown"),
    Type.Literal("footer"),
    Type.Literal("form"),
    Type.Literal("header"),
    Type.Literal("hero"),
    Type.Literal("icon"),
    Type.Literal("image"),
    Type.Literal("images-wall"),
    Type.Literal("map"),
    Type.Literal("social-links"),
    Type.Literal("text"),
    Type.Literal("video"),
  ],
  {
    title: "Brick type",
    description: "The type of the brick. A brick is an element in the layout.",
  },
);

export const brickSchema = Type.Object({
  type: brickTypeSchema,
  id: Type.String({
    title: "ID",
    description: "A unique identifier for the brick.",
  }),
  props: Type.Object(
    Type.Any({
      title: "Props",
      description: "The properties of the brick react component.",
    }),
  ),
  position: Type.Object(
    {
      mobile: brickPositionSchema,
      desktop: brickPositionSchema,
    },
    {
      title: "Position",
      description: "The position of the brick in the layout.",
    },
  ),
});

export type Brick = Static<typeof brickSchema>;

export type BricksLayout = Brick[];
export type ResponsivePosition = Brick["position"];

const definedBrickSchema = Type.Composite([
  Type.Omit(brickSchema, ["id", "position", "manifest"]),
  Type.Object({
    position: Type.Object({
      mobile: definedBrickPositionSchema,
      desktop: definedBrickPositionSchema,
    }),
  }),
]);

export type DefinedBrick = Static<typeof definedBrickSchema>;

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
    desktop: Omit<DefinedBrickPosition, "y">;
  };
};

// Helpers to generate bricks coordonates
const currentRowByBreakpoint: Record<ResponsiveMode, number> = {
  mobile: 0,
  desktop: 0,
};

/**
 * Creates a new row of bricks, automatically setting the `y` property to the current row.
 */
export function createRow<B extends DefinedRowBrick[]>(bricks: B): DefinedBrick[] {
  // Get the max height of the bricks passed
  const maxDesktopHeight = Math.max(
    ...bricks.map((brick) => Math.max(brick.position.desktop?.h ?? 0, brick.position.mobile?.h ?? 0)),
  );

  const maxMobileHeight = Math.max(
    ...bricks.map((brick) => Math.max(brick.position.mobile?.h ?? 0, brick.position.desktop?.h ?? 0)),
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
