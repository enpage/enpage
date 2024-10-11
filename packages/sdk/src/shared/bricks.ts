import { generateId } from "~/browser/bricks/common";

export type ContainerVariant =
  | "full"
  // 2 columns
  | "1-1"
  // 3 columns
  | "1-1-1"
  | "1-2"
  | "2-1"
  // 4 columns
  | "3-1"
  | "1-3"
  | "1-1-1-1"
  | "1-1-2"
  | "2-2"
  | "1-2-1"
  | "2-1-1";

export type BricksContainer = {
  type: "container";
  variant: ContainerVariant;
  bricks: Brick[];
  id: string;
  hidden?: boolean;
};

type BrickWrapper = {
  /**
   * The column start (1-based). When not provided, the brick will just be appended to the row
   * and placed in the next available column.
   */
  colStart?: number;
  /**
   * The column span. If not provided, the brick are divided equally among the columns.
   */
  colSpan?: number;
  /**
   * The span of rows. If not provided, the brick will be 1 row tall.
   * Note that the rown number is determined by the array index of the brick.
   */
  rowSpan?: number;

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

export type Brick = {
  type: string;
  id: string;
  props: Record<string, unknown>;
  wrapper: BrickWrapper;
  // placeholder?: boolean;
};

type DefinedBrick = Omit<Brick, "id" | "wrapper"> & { wrapper?: BrickWrapper };
type DefinedContainers = Omit<BricksContainer, "id" | "bricks"> & { bricks: DefinedBrick[] };

export function defineBricks<B extends DefinedContainers[]>(containers: B): BricksContainer[] {
  return containers.map((ct) => ({
    ...ct,
    id: `container-${generateId()}`,
    bricks: ct.bricks.map((child) => ({
      id: `brick-${generateId()}`,
      wrapper: {},
      ...child,
    })),
  }));
}
