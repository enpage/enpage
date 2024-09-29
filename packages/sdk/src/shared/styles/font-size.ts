import { modularScale, rem, getValueAndUnit } from "polished";
import type { TokenFontSize } from "./types";
import { token } from "./token-helpers";

// Constants for scale generation
const baseSize = 16;
const scaleRatio = 1.25; // Major third scale
const steps = 8;

// Viewport sizes for fluid typography
const minWidth = 320; // Minimum viewport width in pixels
const maxWidth = 1200; // Maximum viewport width in pixels

// Generate the font size scale
const scale: Record<string, TokenFontSize> = {};
const smallerSizes = ["xs", "sm"];
const biggerSizes = ["md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"];

// Helper function to generate fluid sizes using clamp()
const generateFluidSize = (minSize: number, preferredSize: number, maxSize: number) => {
  const minVw = minWidth / 100;
  const maxVw = maxWidth / 100;

  const slope = (maxSize - minSize) / (maxVw - minVw);
  const yAxisIntersection = -minVw * slope + minSize;

  return `clamp(${minSize}rem, ${yAxisIntersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxSize}rem)`;
};

// Generate sizes smaller than the base
for (let i = -2; i < 0; i++) {
  const size = modularScale(i, `${baseSize}px`, scaleRatio);
  const sizeInRem = rem(parseFloat(size), baseSize);
  let [value, unit] = getValueAndUnit(sizeInRem);
  value = parseFloat(value);
  const name = smallerSizes[i + 2];
  const normalSize = `${value.toFixed(2)}${unit}`;
  const fluidSize = generateFluidSize(value * 0.9, value, value * 1.1);

  scale[`font-size-${name}`] = token.fontSize(`Font Size ${name}`, normalSize);
  scale[`font-size-fluid-${name}`] = token.fontSize(`Fluid Font Size ${name}`, fluidSize);
}

// Base size
scale["font-size-base"] = token.fontSize("Base Font Size", "1rem");
scale["font-size-fluid-base"] = token.fontSize("Fluid Base Font Size", generateFluidSize(0.9, 1, 1.1));

// Generate sizes larger than the base
for (let i = 1; i <= steps; i++) {
  const size = modularScale(i, `${baseSize}px`, scaleRatio);
  const sizeInRem = rem(parseFloat(size), baseSize);
  let [value, unit] = getValueAndUnit(sizeInRem);
  value = parseFloat(value);
  const name = biggerSizes[i - 1];
  const normalSize = `${value.toFixed(2)}${unit}`;
  const fluidSize = generateFluidSize(value * 0.9, value, value * 1.1);

  scale[`font-size-${name}`] = token.fontSize(`Font Size ${name}`, normalSize);
  scale[`font-size-fluid-${name}`] = token.fontSize(`Fluid Font Size ${name}`, fluidSize);
}

// Export the generated scale
export const fontSizeScale = scale;

// If you want to export the types as well
export type FontSizeScale = typeof fontSizeScale;
