import { token } from "./token-helpers";

// Generate the font size scale
export const fontSizeScale = {
  // Relatives to the base size
  "font-size-xs": token.fontSize("Font Size XS", "0.75rem"),
  "font-size-sm": token.fontSize("Font Size SM", "0.875rem"),
  "font-size-base": token.fontSize("Font Size Base", "1rem"),
  "font-size-md": token.fontSize("Font Size MD", "1.25rem"),
  "font-size-lg": token.fontSize("Font Size LG", "1.5rem"),
  "font-size-xl": token.fontSize("Font Size XL", "1.875rem"),
  "font-size-2xl": token.fontSize("Font Size 2XL", "2.25rem"),
  "font-size-3xl": token.fontSize("Font Size 3XL", "3rem"),
  "font-size-4xl": token.fontSize("Font Size 4XL", "3.75rem"),
  "font-size-5xl": token.fontSize("Font Size 5XL", "4.5rem"),
  "font-size-6xl": token.fontSize("Font Size 6XL", "6rem"),
  "font-size-7xl": token.fontSize("Font Size 7XL", "8rem"),
  // Fluid sizes
  "font-size-fluid-xs": token.fontSize(
    "Fluid Font Size XS",
    "clamp(0.75rem, calc(0.735rem + 0.0975vw), 0.8475rem)",
  ),
  "font-size-fluid-sm": token.fontSize(
    "Fluid Font Size SM",
    "clamp(0.875rem, calc(0.8575rem + 0.11375vw), 0.98875rem)",
  ),
  "font-size-fluid-base": token.fontSize(
    "Fluid Font Size Base",
    "clamp(1.00rem, calc(0.98rem + 0.13vw), 1.13rem)",
  ),

  "font-size-fluid-md": token.fontSize(
    "Fluid Font Size MD",
    "clamp(1.25rem, calc(1.225rem + 0.1625vw), 1.4125rem)",
  ),
  "font-size-fluid-lg": token.fontSize(
    "Fluid Font Size LG",
    "clamp(1.5rem, calc(1.47rem + 0.195vw), 1.695rem)",
  ),
  "font-size-fluid-xl": token.fontSize(
    "Fluid Font Size XL",
    "clamp(1.875rem, calc(1.8375rem + 0.24375vw), 2.11875rem)",
  ),
  "font-size-fluid-2xl": token.fontSize(
    "Fluid Font Size 2XL",
    "clamp(2.25rem, calc(2.205rem + 0.2925vw), 2.5425rem)",
  ),
  "font-size-fluid-3xl": token.fontSize(
    "Fluid Font Size 3XL",
    "clamp(3rem, calc(2.94rem + 0.39vw), 3.39rem)",
  ),
  "font-size-fluid-4xl": token.fontSize(
    "Fluid Font Size 4XL",
    "clamp(3.75rem, calc(3.675rem + 0.4875vw), 4.2375rem)",
  ),
  "font-size-fluid-5xl": token.fontSize(
    "Fluid Font Size 5XL",
    "clamp(4.5rem, calc(4.41rem + 0.585vw), 5.085rem)",
  ),
  "font-size-fluid-6xl": token.fontSize(
    "Fluid Font Size 6XL",
    "clamp(6rem, calc(5.88rem + 0.78vw), 6.78rem)",
  ),
  "font-size-fluid-7xl": token.fontSize(
    "Fluid Font Size 7XL",
    "clamp(8rem, calc(7.84rem + 1.04vw), 9.04rem)",
  ),
};

// If you want to export the types as well
export type FontSizeScale = typeof fontSizeScale;
