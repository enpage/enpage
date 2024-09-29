import { modularScale, rem, getValueAndUnit } from "polished";
import type { TokenSize } from "./types";
import { token } from "./token-helpers";

// Constants for scale generation
const baseSize = 16; // Base size in pixels
const scaleRatio = 1.2; // Perfect fifth
const steps = 8; // Number of steps in the scale

// Generate the size scale
const scale: Record<string, TokenSize> = {};

// Generate pixel value
scale.sizePx = token.size("Size Pixel", "1px");

// Generate base size
scale.sizeBase = token.size("Size Base", `${baseSize / 16}rem`);

// Generate larger sizes
for (let i = 1; i <= steps; i++) {
  const size = modularScale(i, `${baseSize}px`, scaleRatio);
  let [value, unit] = getValueAndUnit(rem(size, baseSize));
  value = parseFloat(value).toFixed(2);
  scale[`size${i}`] = token.size(`Size ${i}`, `${value}${unit}`);
}

// Export the generated scale
export const sizeScale = scale;

// If you want to export the type as well
export type SizeScale = typeof sizeScale;
