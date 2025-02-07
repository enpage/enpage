import { css, tx } from "@upstart.gg/style-system/twind";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
import { useTheme } from "~/editor/hooks/use-editor";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

export function usePageStyle({
  attributes,
  editable,
  previewMode,
  typography,
}: {
  attributes: Attributes;
  typography: Theme["typography"];
  editable?: boolean;
  previewMode?: ResponsiveMode;
}) {
  const themeUsed = useTheme();
  return tx(
    "grid group/page mx-auto page-container relative",
    isStandardColor(attributes.$backgroundColor) &&
      css({ backgroundColor: attributes.$backgroundColor as string }),
    isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor as string }),
    !isStandardColor(attributes.$backgroundColor) && (attributes.$backgroundColor as string),
    !isStandardColor(attributes.$textColor) && (attributes.$textColor as string),
    typeof attributes.$backgroundImage === "string" &&
      css({
        backgroundImage: `url(${attributes.$backgroundImage})`,
        //todo: make it dynamic, by using attributes
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center top",
      }),
    // mobile grid
    `@mobile:(
      grid-cols-${LAYOUT_COLS.mobile}
      auto-rows-[minmax(${LAYOUT_ROW_HEIGHT}px,_max-content)]
      px-[10px]
      py-[10px]
      min-h-[110%]
      h-fit
      max-w-full
      w-full
    )`,
    // Desktop grid
    `@desktop:(
      grid-cols-${LAYOUT_COLS.desktop}
      auto-rows-[${LAYOUT_ROW_HEIGHT}px]
      px-[${attributes.$pagePadding.horizontal}px]
      py-[${attributes.$pagePadding.vertical}px]
      w-full
      h-fit
      ${attributes.$pageWidth}
    )`,

    // css({
    //   "font-family": `var(--font-${themeUsed.typography.body})`,
    // }),

    getTypographyStyles(typography),

    editable && "transition-all duration-300",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving) {
        &::before {
          content: "";
          position: absolute;
          opacity: 0.3;
          top: ${previewMode === "desktop" ? parseInt(attributes.$pagePadding.vertical as string) : 10}px;
          left: ${previewMode === "desktop" ? parseInt(attributes.$pagePadding.horizontal as string) : 10}px;
          right: ${previewMode === "desktop" ? parseInt(attributes.$pagePadding.horizontal as string) : 10}px;
          bottom: ${previewMode === "desktop" ? parseInt(attributes.$pagePadding.vertical as string) : 10}px;
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
        &>div {
          outline: 2px dotted #d3daf2 !important;
        }
      }
    `,
  );
}

function getTypographyStyles(typography: Theme["typography"]) {
  function formatFontFamily(font: typeof typography.body) {
    return font.type === "stack" ? `var(--font-${font.family})` : font.family;
  }
  return css({
    "font-family": formatFontFamily(typography.body),
    "font-size": `${typography.base}px`,
    "& h1, & h2, & h3, & h4, & h5, & h6, & h7": {
      "font-family": formatFontFamily(typography.heading),
    },
  });
}
