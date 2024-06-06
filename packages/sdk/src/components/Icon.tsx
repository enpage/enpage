/**
 * Docs: https://github.com/simple-icons/simple-icons
 */
import { BlockProps, IconProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Icon({
  slug,
  color,
  ...props
}: Omit<BlockProps<"img", IconProps>, "blockType">) {
  let col = (color ?? "black").replace("#", "");
  return (
    // Hack for img to wrap them in <picture> tag so we get ::after and ::before elements needed for the editor
    <BaseBlock {...props} blockType="element" as="picture" editable>
      <img
        width="100%"
        height="auto"
        src={`https://cdn.simpleicons.org/${slug}/${col}`}
      />
    </BaseBlock>
  );
}
