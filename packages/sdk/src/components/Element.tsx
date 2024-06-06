import { ElementType } from "react";
import { BlockProps, ElementProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Element(
  props: Omit<BlockProps<ElementType, ElementProps>, "blockType">,
) {
  return <BaseBlock {...props} id={props.id} blockType="element" editable />;
}
