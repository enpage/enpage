import { tx, apply } from "@enpage/style-system/twind";
/**
 * The classNames for the brick
 * @param manifest `
 */
export function useBrickStyle<M extends Record<string, unknown>>(props: M, baseClassName = "") {
  const {
    brickRounding,
    borderWidth,
    borderStyle,
    brickPadding,
    brickBackgroundColor,
    borderColor,
    z,
    ...rest
  } = props;

  return tx([
    apply("flex-1", baseClassName),
    // brickBackgroundColor && `bg-${brickBackgroundColor}`,
    // borderColor && `border-${borderColor}`,
    // z && `z-[${z}]`,
    // brickPadding && `brick-p-${brickPadding}`,
    // brickRounding,
    // borderWidth,
    // borderStyle,
  ]);
}
