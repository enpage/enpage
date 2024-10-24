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

export function generateColorHarmony(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb);
  const results: string[] = [baseColor];

  // Complementary color (opposite on the color wheel)
  const complementary: HSL = {
    h: (hsl.h + 180) % 360,
    s: hsl.s,
    l: hsl.l,
  };
  results.push(rgbToHex(hslToRgb(complementary)));

  // Analogous colors (adjacent on the color wheel)
  const analogous1: HSL = {
    h: (hsl.h + 30) % 360,
    s: hsl.s,
    l: hsl.l,
  };
  results.push(rgbToHex(hslToRgb(analogous1)));

  // Split complementary
  const splitComp1: HSL = {
    h: (hsl.h + 150) % 360,
    s: hsl.s,
    l: hsl.l,
  };
  results.push(rgbToHex(hslToRgb(splitComp1)));

  // Triadic color (120° apart)
  const triadic: HSL = {
    h: (hsl.h + 120) % 360,
    s: hsl.s,
    l: hsl.l,
  };
  results.push(rgbToHex(hslToRgb(triadic)));

  return results;
}
