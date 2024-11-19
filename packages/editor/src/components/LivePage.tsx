import { css, tx } from "@enpage/style-system/twind";
import BrickWrapper from "./EditableBrick";
import { useAttributes, useBricks } from "../hooks/use-editor";
import { LAYOUT_COLS } from "@enpage/sdk/shared/layout-constants";
import { isStandardColor } from "@enpage/sdk/shared/themes/color-system";

export default function LivePage() {
  const attributes = useAttributes();
  const bricks = useBricks();

  return (
    <div
      className={tx(
        "grid group/page mx-auto w-full page-container relative transition-all duration-300",
        isStandardColor(attributes.$backgroundColor) && css({ backgroundColor: attributes.$backgroundColor }),
        isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor }),
        !isStandardColor(attributes.$backgroundColor) && attributes.$backgroundColor,
        !isStandardColor(attributes.$textColor) && attributes.$textColor,
        // mobile grid
        `@mobile:(
            grid-cols-${LAYOUT_COLS.mobile}
            px-[10px]
            min-h-[100%]
            max-w-full
          )`,
        // Desktop grid
        `@desktop:(
            grid-cols-${LAYOUT_COLS.desktop}
            px-[${attributes.$pagePaddingHorizontal}px]
            py-[${attributes.$pagePaddingVertical}px]
            w-full
            min-h-[100dvh] h-full
            ${attributes.$pageWidth}
          )`,
      )}
    >
      {bricks.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
}
