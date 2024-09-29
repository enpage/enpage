import { colors } from "../colors";
import { fontSizeScale } from "../font-size";
import { fontFamilies } from "../font-family";
import { borderRadius, borderWidth } from "../border";
import { sizeScale } from "../size";
import { spacing } from "../spacing";
import { fontWeights } from "../font-weight";
import { shadows } from "../shadow";
import { lineHeights } from "../line-height";
import { aspectRatios } from "../aspect-ratio";

/**
 * Default tokens used as a base for the design system
 */
export const defaultTokens = {
  ...colors,
  ...fontSizeScale,
  ...sizeScale,
  ...fontFamilies,
  ...borderRadius,
  ...borderWidth,
  ...fontWeights,
  ...shadows,
  ...lineHeights,
  ...aspectRatios,
  ...spacing,
};
