import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { convertDesktopLayoutToMobile } from "./utils/layout-utils";

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

export type Brick<T extends string = string> = {
  type: T;
  id: string;
  props: Record<string, unknown>;
  position: {
    mobile: BrickPosition;
    tablet?: BrickPosition;
    desktop: BrickPosition;
  };
  // manifest: BrickManifest;
};

export type BricksLayout = Brick[];

// type DefinedBrick = Omit<Brick, "id" | "manifest"> & {
//   manifest?: BrickManifest;
// };
export type DefinedBrick = Omit<Brick, "id">;

export function defineBricks<B extends DefinedBrick[]>(bricks: B): Brick[] {
  const desktopLayout = bricks.map((brick) => brick.position.desktop);
  const mobileLayout = convertDesktopLayoutToMobile(desktopLayout);

  console.log({ mobileLayout });

  bricks.forEach((brick, index) => {
    if (!brick.position.mobile) {
      brick.position.mobile = mobileLayout[index];
    }
  });

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
  position: {
    mobile?: Omit<BrickPosition, "y">;
    tablet?: Omit<BrickPosition, "y">;
    desktop: Omit<BrickPosition, "y">;
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
