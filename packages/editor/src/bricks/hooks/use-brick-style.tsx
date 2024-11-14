import { tx, apply } from "@enpage/style-system/twind";
import type { commonStyleProps, textStyleProps } from "../props/style-props";
import type { commonProps } from "../props/common";
import type { Static } from "@sinclair/typebox";

/**
 * The classNames for the brick
 * @param manifest `
 */
export function useBrickStyle(
  props: Partial<Static<typeof commonStyleProps>> &
    Partial<Static<typeof textStyleProps>> &
    Partial<Static<typeof commonProps>>,
) {
  return tx([
    apply(props.className),
    // apply("flex-1", props.className),
    props.backgroundColor && `bg-${props.backgroundColor}`,
    props.borderColor && `border-${props.borderColor}`,
    props.z && `z-[${props.z}]`,

    props.padding,

    props.borderRadius,
    props.borderStyle,
    props.borderWidth,
    props.shadow,

    props.color && `text-${props.color}`,
    props.fontSize && `text-${props.fontSize}`,
    props.fontWeight && `font-${props.fontWeight}`,
    props.textAlign && `text-${props.textAlign}`,
  ]);
}
