import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { commonStyleProps, textStyleProps, flexProps } from "@upstart.gg/sdk/bricks/props/style-props";
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
    Partial<Static<typeof commonProps>> &
    Partial<Static<typeof flexProps>>,
) {
  // This is the inner brick style. As the wrapper uses "display: flex",
  // we use flex-1 to make the inner brick fill the space.
  return tx("flex-1", [
    props.className && apply(props.className),
    props.dimensions?.padding ? (props.dimensions.padding as string) : null,
    props.color ? `text-${props.color}` : null,
    props.fontSize ? `text-${props.fontSize}` : null,
    props.fontWeight ? `font-${props.fontWeight}` : null,
    props.textAlign ? `text-${props.textAlign}` : null,
    props.flex?.direction ? `flex-${props.flex.direction}` : null,
    props.flex?.wrap ? `flex-${props.flex.wrap}` : null,
    props.flex?.justify ? `justify-${props.flex.justify}` : null,
    props.flex?.align ? `items-${props.flex.align}` : null,
    props.flex?.gap ? `gap-${props.flex.gap}` : null,
  ]);
}

type UseBrickWrapperStyleProps = {
  brick: Brick;
  editable: boolean;
  className?: string;
  isContainerChild?: boolean;
  selected?: boolean;
};

export function useBrickWrapperStyle({
  brick,
  editable,
  className,
  isContainerChild,
  selected,
}: UseBrickWrapperStyleProps) {
  return tx(
    apply(className),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex relative",

    isContainerChild && "container-child",
    editable && selected && "!outline !outline-dashed !outline-orange-200",

    // "overflow-hidden",

    {
      "select-none hover:z-[9999]": editable,
    },

    // container children expand to fill the space
    isContainerChild && "flex-1",

    // Position of the wrapper
    //
    // Note:  for container children, we don't set it as they are not positioned
    //        relatively to the page grid but to the container
    //
    // Warning: those 2 rules blocks are pretty sensible!
    !isContainerChild &&
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
        "&.selected-group": {
          outline: "2px dotted var(--violet-8) !important",
        },
      }),

    // Border
    "border" in brick.props && propToStyle(brick.props.border.color as string, "borderColor"),
    "border" in brick.props && (brick.props.border.radius as string),
    "border" in brick.props && (brick.props.border.style as string),
    "border" in brick.props && (brick.props.border.width as string),

    // Background
    "background" in brick.props && propToStyle(brick.props.background.color as string, "background-color"),
    "background" in brick.props &&
      brick.props.background.image &&
      css({
        backgroundImage: `url(${brick.props.background.image})`,
        backgroundSize: brick.props.background.size ?? "auto",
        backgroundRepeat: brick.props.background.repeat ?? "no-repeat",
      }),

    // Opacity
    "effects" in brick.props && propToStyle(brick.props.effects.opacity as number | undefined, "opacity"),

    // shadow
    "effects" in brick.props && (brick.props.effects.shadow as string),

    // z-index
    // (brick.props.z as string) && `z-[${brick.props.z}]`,
  );
}
