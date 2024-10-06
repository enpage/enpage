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

export type Brick = {
  type: string;
  id: string;
  props: { /*id: string; className?: string */ customStyles?: Record<string, string> };
  placeholder?: boolean;
};

type DefinedBrick = Omit<Brick, "id">;
type DefinedContainers = Omit<BricksContainer, "id" | "bricks"> & { bricks: DefinedBrick[] };

export function defineBricks<B extends DefinedContainers[]>(containers: B): BricksContainer[] {
  return containers.map((ct) => ({
    ...ct,
    id: `container-${generateId()}`,
    bricks: ct.bricks.map((child) => ({
      id: `brick-${generateId()}`,
      ...child,
    })),
  }));
}
