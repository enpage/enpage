import { css, tx } from "@upstart.gg/style-system/twind";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";

export function usePageStyle({
  attributes,
  editable,
  previewMode,
}: { attributes: Attributes; editable?: boolean; previewMode?: ResponsiveMode }) {
  return tx(
    "grid group/page mx-auto w-full page-container relative",
    isStandardColor(attributes.$backgroundColor) &&
      css({ backgroundColor: attributes.$backgroundColor as string }),
    isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor as string }),
    !isStandardColor(attributes.$backgroundColor) && (attributes.$backgroundColor as string),
    !isStandardColor(attributes.$textColor) && (attributes.$textColor as string),
    // mobile grid
    `@mobile:(
      grid-cols-${LAYOUT_COLS.mobile}
      auto-rows-[minmax(${LAYOUT_ROW_HEIGHT}px,_max-content)]
      px-[10px]
      py-[10px]
      min-h-[110%]
      max-w-full
    )`,
    // Desktop grid
    `@desktop:(
      grid-cols-${LAYOUT_COLS.desktop}
      auto-rows-[${LAYOUT_ROW_HEIGHT}px]
      px-[${attributes.$pagePaddingHorizontal}px]
      py-[${attributes.$pagePaddingVertical}px]
      w-full
      min-h-[100dvh] h-full
      ${attributes.$pageWidth}
    )`,
    editable && "transition-all duration-300",
    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving) {
        &::before {
          content: "";
          position: absolute;
          opacity: 0.5;
          top: ${previewMode === "desktop" ? parseInt(attributes.$pagePaddingVertical as string) : 10}px;
          left: ${previewMode === "desktop" ? parseInt(attributes.$pagePaddingHorizontal as string) : 10}px;
          right: ${previewMode === "desktop" ? parseInt(attributes.$pagePaddingHorizontal as string) : 10}px;
          bottom: ${previewMode === "desktop" ? parseInt(attributes.$pagePaddingVertical as string) : 10}px;
          pointer-events: none;
          background-size:
            calc(100%/${LAYOUT_COLS[previewMode]}) 100%,
            100% ${LAYOUT_ROW_HEIGHT}px;
          background-image:
            repeating-linear-gradient(to right,
              rgba(81, 101, 255, 0.3) 0px,
              rgba(81, 101, 255, 0.3) 1px,
              transparent 1px,
              transparent 200px
            ),
            repeating-linear-gradient(to bottom,
              rgba(81, 101, 255, 0.3) 0px,
              rgba(81, 101, 255, 0.3) 1px,
              transparent 1px,
              transparent 80px
            );
        }
      }
    `,
  );
}
