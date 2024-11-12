import type { Theme } from "@enpage/sdk/shared/theme";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

type ColorType = keyof Theme["colors"] | "generic";

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(rgb: RGB): string {
  return `#${[rgb.r, rgb.g, rgb.b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function adjustHSL(hsl: HSL, adjustments: Partial<HSL>): HSL {
  return {
    h: (hsl.h + (adjustments.h || 0)) % 360,
    s: Math.max(0, Math.min(100, hsl.s + (adjustments.s || 0))),
    l: Math.max(0, Math.min(100, hsl.l + (adjustments.l || 0))),
  };
}

export function generateColorHarmony(theme: Theme["colors"], forType: ColorType): string[] {
  // Validation
  if (forType === "primary" && !theme.primary) {
    throw new Error("Primary color is required as base for other colors");
  }

  const baseHsl = rgbToHsl(hexToRgb(theme.primary!));
  let suggestions: HSL[] = [];

  switch (forType) {
    case "primary":
      // For primary, generate variations of the existing primary
      suggestions = [
        baseHsl, // Original
        adjustHSL(baseHsl, { l: -10 }), // Darker
        adjustHSL(baseHsl, { l: 10 }), // Lighter
        adjustHSL(baseHsl, { s: 10 }), // More saturated
        adjustHSL(baseHsl, { h: 5 }), // Slight hue shift
      ];
      break;

    case "secondary":
      // Secondary is typically analogous or complementary to primary
      suggestions = [
        adjustHSL(baseHsl, { h: 30 }), // Analogous
        adjustHSL(baseHsl, { h: 180, s: -10 }), // Complementary, less saturated
        adjustHSL(baseHsl, { h: 210, s: -5 }), // Split-complementary
        adjustHSL(baseHsl, { h: 150, s: -15 }), // Triadic variant
        adjustHSL(baseHsl, { h: 45, s: -10, l: 5 }), // Custom harmony
      ];
      break;

    case "tertiary":
      // Tertiary usually complements both primary and secondary
      suggestions = [
        adjustHSL(baseHsl, { h: 120 }), // Triadic
        adjustHSL(baseHsl, { h: 90, s: -15 }), // Custom angle
        adjustHSL(baseHsl, { h: 150, s: -10, l: 5 }), // Custom harmony
        adjustHSL(baseHsl, { h: 60, s: -20 }), // Split complement
        adjustHSL(baseHsl, { h: 180, s: -25, l: 10 }), // Muted complement
      ];
      break;

    case "accent":
      // Accent should pop but harmonize
      suggestions = [
        adjustHSL(baseHsl, { h: 180, s: 10, l: 10 }), // Bright complement
        adjustHSL(baseHsl, { h: -150, s: 15, l: 5 }), // Vibrant variant
        adjustHSL(baseHsl, { h: 120, s: 20 }), // Triadic with boost
        adjustHSL(baseHsl, { h: -120, s: 25, l: -5 }), // Bold contrast
        adjustHSL(baseHsl, { h: 90, s: 15, l: 15 }), // Eye-catching variant
      ];
      break;
  }

  const dedup = Array.from(new Set(suggestions.map((hsl) => rgbToHex(hslToRgb(hsl)))));

  if (dedup.length > 2) {
    return dedup;
  }

  return [];
}
