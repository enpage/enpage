import { tx, apply, css } from "@enpage/style-system/twind";
import type { commonStyleProps, textStyleProps } from "../props/style-props";
import type { commonProps } from "../props/common";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@enpage/sdk/shared/bricks";
import { propToStyle } from "@enpage/sdk/shared/themes/color-system";

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
    props.z && `z-[${props.z}]`,
    props.padding,
    props.shadow,
    props.color && `text-${props.color}`,
    props.fontSize && `text-${props.fontSize}`,
    props.fontWeight && `font-${props.fontWeight}`,
    props.textAlign && `text-${props.textAlign}`,
  ]);
}

export function useBrickWrapperStyle({
  brick,
  editable,
  className,
}: { brick: Brick; editable: boolean; className?: string }) {
  return tx(
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative overflow-hidden",
    {
      "select-none group-hover/page:(outline outline-dashed outline-upstart-100/20) hover:(z-[9999] shadow-lg)":
        editable,
    },
    className,
    `@desktop:(
        col-start-${brick.position.desktop.x + 1}
        col-span-${brick.position.desktop.w}
        row-start-${brick.position.desktop.y + 1}
        row-span-${brick.position.desktop.h}
      )
      @mobile:(
        col-start-${brick.position.mobile.x + 1}
        col-span-${brick.position.mobile.w})
        row-start-${brick.position.mobile.y + 1}
        row-span-${brick.position.mobile.h}
      )`,
    editable &&
      css({
        "&.selected": {
          outline: "2px dotted var(--violet-8) !important",
        },
      }),

    // Border
    propToStyle(brick.props.borderColor as string, "borderColor"),
    brick.props.borderRadius as string,
    brick.props.borderStyle as string,
    brick.props.borderWidth as string,

    // Background
    propToStyle(brick.props.backgroundColor as string, "background"),

    // Opacity
    propToStyle(brick.props.opacity as number | undefined, "opacity"),

    // shadow
    brick.props.shadow as string,
  );
}
