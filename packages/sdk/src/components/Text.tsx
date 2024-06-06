import { BlockProps, TextProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Text(props: Omit<BlockProps<"span", TextProps>, "blockType">) {
  return (
    <BaseBlock
      textEditable
      {...props}
      as={props.as ?? "span"}
      blockType="text"
      editable
    />
  );
}
