import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { commonStyleProps, textStyleProps } from "@upstart.gg/sdk/bricks/props/style-props";
import type { commonProps } from "@upstart.gg/sdk/bricks/props/common";
import type { Static } from "@sinclair/typebox";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";

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
    props.className && apply(props.className),
    props.padding ? (props.padding as string) : null,
    props.color ? `text-${props.color}` : null,
    props.fontSize ? `text-${props.fontSize}` : null,
    props.fontWeight ? `font-${props.fontWeight}` : null,
    props.textAlign ? `text-${props.textAlign}` : null,
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
    // Warning: those 2 rules blocks are pretty sensible!
    `@desktop:(
        col-start-${brick.position.desktop.x + 1}
        col-span-${brick.position.desktop.w}
        row-start-${brick.position.desktop.y + 1}
        row-span-${brick.position.desktop.h}
        h-auto
      )
      @mobile:(
        col-start-${brick.position.mobile.x + 1}
        col-span-${brick.position.mobile.w}
        row-start-${brick.position.mobile.y + 1}
        row-span-${brick.position.mobile.manualHeight ?? brick.position.mobile.h}
        ${brick.position.mobile.manualHeight ? `h-[${brick.position.mobile.manualHeight * LAYOUT_ROW_HEIGHT}px]` : ""}
      )`,

    editable &&
      css({
        "&.selected": {
          outline: "2px dotted var(--violet-8) !important",
        },
      }),

    // Border
    "borderColor" in brick.props && propToStyle(brick.props.borderColor as string, "borderColor"),
    "borderRadius" in brick.props && (brick.props.borderRadius as string),
    "borderStyle" in brick.props && (brick.props.borderStyle as string),
    "borderWidth" in brick.props && (brick.props.borderWidth as string),

    // Background
    "backgroundColor" in brick.props && propToStyle(brick.props.backgroundColor as string, "background"),

    // Opacity
    "opacity" in brick.props && propToStyle(brick.props.opacity as number | undefined, "opacity"),

    // shadow
    "shadow" in brick.props && (brick.props.shadow as string),

    // z-index
    (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}
