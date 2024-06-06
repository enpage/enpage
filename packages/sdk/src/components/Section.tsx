import { BlockProps, SectionProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Section(
  props: Omit<BlockProps<"div", SectionProps>, "blockType">,
) {
  return <BaseBlock {...props} blockType="section" editable />;
}
