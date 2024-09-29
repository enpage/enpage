import { token } from "./token-helpers";
import { parseToHsl, hsl, getLuminance, getContrast } from "polished";
import type { TokenColor } from "./types";
import { baseColors } from "./baseColors";

// Define color names as a union type
type ColorName = keyof typeof baseColors;

// Define color shade numbers
type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

// Define harmonious color suffixes
type HarmoniousSuffix = "analogous-1" | "analogous-2" | "complementary";

// Define the structure for our flattened color system
type FlattenedColors = {
  [K in ColorName]: TokenColor;
} & {
  [K in ColorName as `${K}-${ColorShade}`]: TokenColor;
} & {
  [K in ColorName as `${K}-${HarmoniousSuffix}`]: TokenColor;
} & {
  black: TokenColor;
  white: TokenColor;
};

// Color generation function
function generateColorScale(baseColor: string, name: string): Record<ColorShade | string, TokenColor> {
  const scale = {} as Record<ColorShade | string, TokenColor>;
  const { hue, saturation, lightness } = parseToHsl(baseColor);

  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((shade, index) => {
    // Calculate a lightness adjustment factor
    const lightnessAdjustment = (index - 5) / 10; // -0.5 to 0.5
    // Adjust lightness, ensuring it stays within 0.1 and 0.9
    const adjustedLightness = Math.max(0.1, Math.min(0.9, lightness + lightnessAdjustment));
    // Adjust saturation slightly for lighter and darker shades
    const adjustedSaturation = Math.max(0, Math.min(1, saturation + lightnessAdjustment * 0.2));

    const color = hsl({
      hue,
      saturation: adjustedSaturation,
      lightness: adjustedLightness,
    });

    scale[shade] = token.color(`${name} ${shade}`, color);
  });

  scale[name] = scale[500]; // Set the base color to the 500 shade

  return scale;
}

function generateHarmoniousColors(baseColor: string, name: string): Record<HarmoniousSuffix, TokenColor> {
  const { hue, saturation, lightness } = parseToHsl(baseColor);

  return {
    "analogous-1": token.color(`${name} Analogous 1`, hsl({ hue: (hue + 30) % 360, saturation, lightness })),
    "analogous-2": token.color(
      `${name} Analogous 2`,
      hsl({ hue: (hue - 30 + 360) % 360, saturation, lightness }),
    ),
    complementary: token.color(
      `${name} Complementary`,
      hsl({ hue: (hue + 180) % 360, saturation, lightness }),
    ),
  };
}

// Generate the flattened color palette
export const colors: FlattenedColors = Object.entries(baseColors).reduce(
  (acc, [name, color]) => {
    const colorScale = generateColorScale(color, name);
    const harmoniousColors = generateHarmoniousColors(color, name);

    return {
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...acc,
      [name]: colorScale[name],
      ...Object.entries(colorScale).reduce(
        (scaleAcc, [shade, tokenColor]) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...scaleAcc,
          [name === shade ? `${name}` : `${name}-${shade}`]: tokenColor,
        }),
        {},
      ),
      ...Object.entries(harmoniousColors).reduce(
        (harmonicAcc, [suffix, tokenColor]) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...harmonicAcc,
          [`${name}-${suffix}`]: tokenColor,
        }),
        {},
      ),
    };
  },
  { black: token.color("Black", "#000000"), white: token.color("White", "#ffffff") } as FlattenedColors,
);

// Function to generate accessible color pairs
function generateAccessibleColorPairs(colors: FlattenedColors) {
  const pairs: Array<{ background: string; foreground: string; contrast: number }> = [];

  Object.entries(colors).forEach(([bgKey, bgColor]) => {
    Object.entries(colors).forEach(([fgKey, fgColor]) => {
      if (bgKey !== fgKey) {
        const contrast = getContrast(bgColor.value, fgColor.value);
        if (contrast >= 4.5) {
          // WCAG AA standard for normal text
          pairs.push({
            background: bgKey,
            foreground: fgKey,
            contrast: parseFloat(contrast.toFixed(2)),
          });
        }
      }
    });
  });

  return pairs.sort((a, b) => b.contrast - a.contrast);
}

// Generate accessible color pairs
export const accessibleColorPairs = generateAccessibleColorPairs(colors);

// Helper function to get recommended color pairs for a given background color
export function getRecommendedPairs(backgroundColor: keyof FlattenedColors, limit = 5) {
  return accessibleColorPairs.filter((pair) => pair.background === backgroundColor).slice(0, limit);
}

// Helper function to check if a color combination meets WCAG AA standards
export function meetsWCAGAA(backgroundColor: string, foregroundColor: string) {
  const contrast = getContrast(backgroundColor, foregroundColor);
  return {
    normalText: contrast >= 4.5,
    largeText: contrast >= 3,
    contrast,
  };
}

// Export types
export type { FlattenedColors, ColorName, ColorShade };
export type AccessibleColorPair = (typeof accessibleColorPairs)[number];
