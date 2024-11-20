import { tx, apply, css } from "@enpage/style-system/twind";
import type { commonStyleProps, textStyleProps } from "../bricks/props/style-props";
import type { commonProps } from "../bricks/props/common";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@enpage/sdk/shared/bricks";
import { propToStyle } from "@enpage/sdk/shared/themes/color-system";
import { LAYOUT_ROW_HEIGHT } from "@enpage/sdk/shared/layout-constants";

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
    props.padding,
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
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative overflow-hidden",
    {
      "select-none group-hover/page:(outline outline-dashed outline-upstart-100/20) hover:(z-[9999] shadow-lg)":
        editable,
    },
    `@desktop:(
        col-start-${brick.position.desktop.x + 1}
        col-span-${brick.position.desktop.w}
        row-start-${brick.position.desktop.y + 1}
        row-span-${brick.position.desktop.h}
      )

      @mobile:(
        col-start-${brick.position.mobile.x + 1}
        col-span-${brick.position.mobile.w}
        row-start-${brick.position.mobile.y + 1}
        row-span-${brick.position.mobile.manualHeight ?? brick.position.mobile.h}
      )`,
    brick.position.mobile.manualHeight &&
      css({ height: `${brick.position.mobile.manualHeight * LAYOUT_ROW_HEIGHT}px` }),

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

    // z-index
    (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}
