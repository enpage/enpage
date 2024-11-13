/**
 * The grid is always 12 columns wide.
 */
export const LAYOUT_COLS = {
  desktop: 12,
  tablet: 12,
  mobile: 12,
};

export const LAYOUT_BREAKPOINTS = {
  desktop: 1024,
  tablet: 768,
  mobile: 1,
};

/**
 * Important: keep the same pdding for x and y.
 */
export const LAYOUT_PADDING: Record<string, [number, number]> = {
  desktop: [20, 20],
  tablet: [16, 16],
  mobile: [8, 8],
};

export const LAYOUT_GUTTERS: Record<string, [number, number]> = {
  desktop: [20, 20],
  tablet: [16, 16],
  mobile: [8, 8],
};

/**
 * This is the height of a row in the layout grid.
 */
export const LAYOUT_ROW_HEIGHT = 20;
