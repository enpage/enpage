import { BlockProps, ContainerProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Container(
  props: Omit<BlockProps<"div", ContainerProps>, "blockType">,
) {
  return (
    <BaseBlock
      {...props}
      preventReordering={props.preventReordering ?? false}
      blockType="container"
      editable
    />
  );
}
