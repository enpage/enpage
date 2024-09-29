import { modularScale, rem, getValueAndUnit } from "polished";
import type { TokenSize } from "./tokens";
import { token } from "./token-helpers";

// Constants for scale generation
const scaleRatioRem = 1.333; // Major third scale
const steps = 12; // Number of steps in the scale

// Generate the size scale
const scale = {
  "size-1": token.size("Size 1", "0.25rem"),
  "size-2": token.size("Size 2", "0.5rem"),
  "size-3": token.size("Size 3", "1rem"),
};

// Start key
let key = Object.keys(scale).length + 1;

// Generate larger sizes
for (let i = 1; i <= steps; i++) {
  const sizeRem = modularScale(i, `1rem`, scaleRatioRem);

  let [valueRem, unitRem] = getValueAndUnit(sizeRem);

  valueRem = parseFloat(valueRem).toFixed(2);

  // relative sizes in rem
  scale[`size-${key}`] = token.size(`Size ${key}`, `${valueRem}${unitRem}`);

  // fluid sizes using clamp()
  const minSize = valueRem * 0.9;
  const maxSize = valueRem * 1.1;
  const fluidSize = `clamp(${minSize.toFixed(2)}rem, ${(minSize * 4).toFixed(2)}vw, ${maxSize.toFixed(2)}rem)`;
  scale[`size-fluid-${key}`] = token.size(`Fluid Size ${key}`, fluidSize);

  key++;
}

// Generate pixel value
scale["size-px"] = token.size("Size Pixel", "1px");
// Generate base size
scale["size-rem"] = token.size("Size Base", `1rem`);

// Export the generated scale
export const sizeScale = scale;

// If you want to export the type as well
export type SizeScale = typeof sizeScale;

function roundToNearestFive(num: number): number {
  return Math.round(num * 20) / 20;
}
