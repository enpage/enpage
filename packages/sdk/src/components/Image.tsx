import { BlockProps, ImageProps } from "../types";
import { BaseBlock } from "./BaseBlock";

export function Image(props: Omit<BlockProps<"img", ImageProps>, "blockType">) {
  console.log("ImssZZZZZZg props", props);
  return (
    // Hack for img to wrap them in <picture> tag so we get ::after and ::before elements needed for the editor
    <BaseBlock {...props} blockType="image" as="picture" editable>
      <img {...props} />
    </BaseBlock>
  );
}
