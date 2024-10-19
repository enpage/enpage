import { generateId } from "~/browser/bricks/common";

export const GRID_COLS = 12;

export type BricksContainer = {
  type: "container";
  bricks: Brick[];
  id: string;
  hidden?: boolean;
};

type BrickWrapper = {
  // Base styles are always applied but can be overridden by fixed or custom styles
  baseStyles?: Record<string, string>;
  // Fixed styles are always applied and cannot be overridden
  fixedStyles?: Record<string, string>;
  // Custom styles are always applied and can override base styles
  customStyles?: Record<string, string>;
  // Base classes are always applied but can be overridden by fixed or custom classes
  baseClasses?: string | string[];
  // Fixed classes are always applied and cannot be overridden
  fixedClasses?: string | string[];
  // Custom classes are always applied and can override base classes
  customClasses?: string | string[];
};

type BrickPosition = {
  /**
   * The column start (1-based). When not provided, the brick will just be appended to the row
   * and placed in the next available column.
   */
  colStart: number;
  /**
   * The column span. If not provided, the brick are divided equally among the columns.
   */
  colEnd: number;
  /**
   * The span of rows. If not provided, the brick will be 1 row tall.
   * Note that the rown number is determined by the array index of the brick.
   */
  rowSpan?: number;
};

export type Brick<T extends string = string> = {
  type: T;
  id: string;
  props: Record<string, unknown>;
  wrapper: BrickWrapper;
  position: BrickPosition;
};

type DefinedBrick = Omit<Brick, "id" | "wrapper" | "position"> & {
  wrapper?: BrickWrapper;
  position?: Partial<BrickPosition>;
};

type DefinedContainer = Omit<BricksContainer, "id" | "bricks"> & { bricks: DefinedBrick[] };

export function defineContainers<B extends DefinedContainer[]>(containers: B): BricksContainer[] {
  const finalContainers = containers.map((ct) => ({
    ...ct,
    id: `container-${generateId()}`,
  })) as BricksContainer[];

  finalContainers.forEach((container, containerId, containers) => {
    container.bricks.forEach((brick, brickId) => {
      (brick as Brick).id = `brick-${generateId()}`;
      // @ts-ignore
      brick.position ??= {};
      brick.wrapper ??= {};

      if (brick.position.colStart === undefined) {
        brick.position.colStart = computeColStart(
          brick as Brick,
          brickId,
          container as BricksContainer,
          brickId > 0 ? finalContainers[containerId].bricks.at(brickId - 1) : undefined,
        );
      }

      if (brick.position.colEnd === undefined) {
        brick.position.colEnd = computeColEnd(brick as Brick, brickId, container as BricksContainer);
      }

      finalContainers[containerId].bricks[brickId] = brick;
    });
  });

  return finalContainers;

  // return containers.map((ct) => ({
  //   ...ct,
  //   id: `container-${generateId()}`,
  //   bricks: ct.bricks.map((child) => ({
  //     id: `brick-${generateId()}`,
  //     wrapper: {},
  //     position: {},
  //     ...child,
  //   })),
  // }));
}

/**
 * Compute the brick column start index based on the the brick index in a $GRID_COLS-column grid.
 */
function computeColStart(
  brick: Brick,
  brickIndex: number,
  container: BricksContainer,
  previousBrick?: Brick,
) {
  if (previousBrick) {
    return previousBrick.position.colEnd;
  }
  return (GRID_COLS / container.bricks.length) * brickIndex + 1;
}

/**
 * Compute the brick column end index
 */
function computeColEnd(brick: Brick, brickIndex: number, container: BricksContainer) {
  const bricksCount = container.bricks.length;
  // check if the brick is the last one in the container
  if (brickIndex === bricksCount - 1) {
    return GRID_COLS + 1;
  }
  // by default, the brick will span one column
  return brick.position.colStart + 1;
}
