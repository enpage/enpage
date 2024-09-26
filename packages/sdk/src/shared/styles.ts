import type * as CSS from "csstype";
import {
  darken,
  lighten,
  desaturate,
  modularScale,
  parseToHsl,
  hsl,
  rem,
  readableColor,
  parseToRgb,
  getValueAndUnit,
  rgba,
} from "polished";
import type { ResponsiveMode } from "./responsive";

// Base interfaces
export interface BaseToken {
  name: string;
  group?: string;
  advanced?: boolean;
}

interface Responsive<T> {
  responsive?: boolean;
  responsiveDefaultValue?: Record<ResponsiveMode, T>;
}

// Token types
export interface TokenColor extends BaseToken, Responsive<string> {
  type: "color";
  value: string;
}

export interface TokenFontFamily extends BaseToken, Responsive<string> {
  type: "font-family";
  value: string;
}

export interface TokenFontSize extends BaseToken, Responsive<string> {
  type: "font-size";
  value: string;
}

export interface TokenFontWeight extends BaseToken, Responsive<string> {
  type: "font-weight";
  value: string;
}

export interface TokenSize extends BaseToken, Responsive<string> {
  type: "size";
  value: string;
}

export interface TokenSpacing extends BaseToken, Responsive<string> {
  type: "spacing";
  value: string;
}

export interface TokenBorderRadius extends BaseToken, Responsive<string> {
  type: "borderRadius";
  value: string;
}

export interface TokenBorderWidth extends BaseToken, Responsive<string> {
  type: "borderWidth";
  value: string;
}

export interface TokenShadow extends BaseToken, Responsive<string> {
  type: "shadow";
  value: string;
}

export interface TokenAlias extends BaseToken, Responsive<string> {
  type: "alias";
  value: string; // This will be the path to the referenced token
  resolvedValue?: string; // This will hold the actual value after resolution
}

export type Token =
  | TokenColor
  | TokenFontFamily
  | TokenFontSize
  | TokenFontWeight
  | TokenSize
  | TokenSpacing
  | TokenBorderRadius
  | TokenBorderWidth
  | TokenShadow
  | TokenAlias;

export type TokensMap = {
  [key: string]: Token;
};

export type ResolvedTokensMap = {
  [K in keyof TokensMap]: TokensMap[K]["value"];
};

// Theme type
export type ThemeValues = {
  [key: string]: string;
};

// Helper type to extract the value type from a Token
type TokenValue<T> = T extends Token ? T["value"] : never;

// Helper type to check if a type is a Token or a nested structure
type IsToken<T> = T extends Token ? true : false;

// Create a type that represents the structure of our tokens
type TokenStructure<T> = {
  [K in keyof T]: IsToken<T[K]> extends true
    ? TokenValue<T[K]>
    : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      T[K] extends Record<string, any>
      ? TokenStructure<T[K]>
      : never;
};

// Define the Theme type
export type Theme<T> = {
  default: Partial<TokenStructure<T>>;
  light?: Partial<TokenStructure<T>>;
  dark?: Partial<TokenStructure<T>>;
};

// Helper functions
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Helper function to flatten nested objects
function flattenObject(obj: Record<string, any>, prefix = ""): Record<string, string> {
  return Object.keys(obj).reduce(
    (acc, k) => {
      const pre = prefix.length ? `${prefix}-` : "";
      if (typeof obj[k] === "object" && obj[k] !== null && !("type" in obj[k])) {
        Object.assign(acc, flattenObject(obj[k], `${pre}${k}`));
      } else if (typeof obj[k] === "object" && "value" in obj[k]) {
        acc[`${pre}${k}`] = obj[k].value;
      } else {
        acc[`${pre}${k}`] = obj[k];
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

// Token creation helpers
export const token = {
  color(
    name: string,
    value: string,
    opts?: Omit<TokenColor, "name" | "type" | "value" | "apply">,
  ): TokenColor {
    return { type: "color", name, value, ...opts };
  },
  fontFamily(
    name: string,
    value: string,
    opts?: Omit<TokenFontFamily, "name" | "type" | "value">,
  ): TokenFontFamily {
    return { type: "font-family", name, value, ...opts };
  },
  fontSize(
    name: string,
    value: string,
    opts?: Omit<TokenFontSize, "name" | "type" | "value">,
  ): TokenFontSize {
    return { type: "font-size", name, value, ...opts };
  },
  fontWeight(
    name: string,
    value: string,
    opts?: Omit<TokenFontWeight, "name" | "type" | "value">,
  ): TokenFontWeight {
    return { type: "font-weight", name, value, ...opts };
  },
  size(name: string, value: string, opts?: Omit<TokenSize, "name" | "type" | "value">): TokenSize {
    return { type: "size", name, value, ...opts };
  },
  spacing(name: string, value: string, opts?: Omit<TokenSpacing, "name" | "type" | "value">): TokenSpacing {
    return { type: "spacing", name, value, ...opts };
  },
  borderRadius(
    name: string,
    value: string,
    opts?: Omit<TokenBorderRadius, "name" | "type" | "value">,
  ): TokenBorderRadius {
    return { type: "borderRadius", name, value, ...opts };
  },
  borderWidth(
    name: string,
    value: string,
    opts?: Omit<TokenBorderWidth, "name" | "type" | "value">,
  ): TokenBorderWidth {
    return { type: "borderWidth", name, value, ...opts };
  },
  shadow(name: string, value: string, opts?: Omit<TokenShadow, "name" | "type" | "value">): TokenShadow {
    return { type: "shadow", name, value, ...opts };
  },
  alias(name: string, value: string, opts?: Omit<TokenAlias, "name" | "type" | "value">): TokenAlias {
    return { type: "alias", name, value, ...opts };
  },
};

function resolveAliases(tokens: TokensMap) {
  const resolvedTokens = { ...tokens };

  function resolveValue(value: string): string {
    const parts = value.split(".");

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let current: any = resolvedTokens;
    for (const part of parts) {
      if (current[part] === undefined) {
        throw new Error(`Unable to resolve alias: ${value}`);
      }
      current = current[part];
    }
    if (typeof current === "object" && current.type === "alias") {
      return resolveValue(current.value);
    }
    return current.value;
  }

  for (const [key, token] of Object.entries(resolvedTokens)) {
    if (token.type === "alias") {
      (token as TokenAlias).resolvedValue = resolveValue(token.value);
    }
  }

  return resolvedTokens;
}

export const colors = {
  black: token.color("Black", "#000000"),
  white: token.color("White", "#ffffff"),

  // Neutrals
  ...generateColorScale("#6B7280", "gray"),
  ...generateColorScale("#64748B", "slate"),
  ...generateColorScale("#71717A", "zinc"),
  ...generateColorScale("#737373", "neutral"),
  ...generateColorScale("#78716C", "stone"),

  // Blues
  ...generateColorScale("#3B82F6", "blue"),
  ...generateColorScale("#0EA5E9", "sky"),
  ...generateColorScale("#06B6D4", "cyan"),
  ...generateColorScale("#22D3EE", "lightBlue"),

  // Greens
  ...generateColorScale("#10B981", "green"),
  ...generateColorScale("#14B8A6", "teal"),
  ...generateColorScale("#34D399", "emerald"),
  ...generateColorScale("#4ADE80", "lime"),

  // Reds
  ...generateColorScale("#EF4444", "red"),
  ...generateColorScale("#F43F5E", "pink"),
  ...generateColorScale("#E11D48", "rose"),

  // Yellows and Oranges
  ...generateColorScale("#F59E0B", "yellow"),
  ...generateColorScale("#F97316", "orange"),
  ...generateColorScale("#FBBF24", "amber"),

  // Purples
  ...generateColorScale("#8B5CF6", "purple"),
  ...generateColorScale("#A855F7", "violet"),
  ...generateColorScale("#D946EF", "fuchsia"),

  // Browns
  ...generateColorScale("#78350F", "brown"),
  ...generateColorScale("#92400E", "amber"),

  // Additional colors
  ...generateColorScale("#14B8A6", "turquoise"),
  ...generateColorScale("#84CC16", "chartreuse"),
  ...generateColorScale("#7C3AED", "indigo"),
};

export const fontSizes = generateFontSizeScale();
export const sizeScale = generateSizeScale();
/**
 * Default tokens used as a base for the design system
 */
const defaultTokens = {
  ...colors,
  ...fontSizes,
  ...sizeScale,
  // Colors (unchanged, as colors don't use units)
  $primaryColor: token.color("Primary Color", "#0070f3"),
  $secondaryColor: token.color("Secondary Color", "#ff4081"),
  $accentColor: token.color("Accent Color", "#00c853"),
  $backgroundColor: token.color("Background Color", "#ffffff"),
  $surfaceColor: token.color("Surface Color", "#f5f5f5"),
  $textColor: token.color("Text Color", "#333333"),
  $textPrimaryColor: token.color("Primary Text Color", "#333333"),
  $textSecondaryColor: token.color("Secondary Text Color", "#666666"),
  $linkColor: token.color("Link Color", "#0070f3"),
  $successColor: token.color("Success Color", "#4caf50"),
  $warningColor: token.color("Warning Color", "#ff9800"),
  $errorColor: token.color("Error Color", "#f44336"),

  // Typography
  $fontHeading: token.fontFamily(
    "Heading Font",
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  ),
  $fontBody: token.fontFamily(
    "Body Font",
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  ),
  $fontWeightNormal: token.fontWeight("Normal Font Weight", "400"),
  $fontWeightBold: token.fontWeight("Bold Font Weight", "700"),
  $lineHeightBase: token.fontFamily("Base Line Height", "1.5"),

  // Spacing
  $spacingXSmall: token.spacing("Extra Small Spacing", "0.25rem"),
  $spacingSmall: token.spacing("Small Spacing", "0.5rem"),
  $spacingMedium: token.spacing("Medium Spacing", "1rem"),
  $spacingLarge: token.spacing("Large Spacing", "1.5rem"),
  $spacingXLarge: token.spacing("Extra Large Spacing", "2rem"),

  // Border
  $borderRadiusSmall: token.borderRadius("Small Border Radius", "0.125rem"),
  $borderRadiusMedium: token.borderRadius("Medium Border Radius", "0.25rem"),
  $borderRadiusLarge: token.borderRadius("Large Border Radius", "0.5rem"),
  $borderWidthThin: token.borderWidth("Thin Border Width", "1px"),
  $borderWidthMedium: token.borderWidth("Medium Border Width", "2px"),
  $borderWidthThick: token.borderWidth("Thick Border Width", "4px"),

  // Shadows
  $shadowSmall: token.shadow(
    "Small Shadow",
    "0 0.0625rem 0.1875rem rgba(0,0,0,0.12), 0 0.0625rem 0.125rem rgba(0,0,0,0.24)",
  ),
  $shadowMedium: token.shadow(
    "Medium Shadow",
    "0 0.1875rem 0.375rem rgba(0,0,0,0.15), 0 0.125rem 0.25rem rgba(0,0,0,0.12)",
  ),
  $shadowLarge: token.shadow(
    "Large Shadow",
    "0 0.625rem 1.25rem rgba(0,0,0,0.15), 0 0.1875rem 0.375rem rgba(0,0,0,0.10)",
  ),

  // Layout
  $containerMaxWidth: token.size("Container Max Width", "75rem"),
  $breakpointMobile: token.size("Mobile Breakpoint", "480px"),
  $breakpointTablet: token.size("Tablet Breakpoint", "768px"),
  $breakpointDesktop: token.size("Desktop Breakpoint", "1367px"),

  // Components
  $buttonPrimaryBackground: token.color("Button Primary Background", "#0070f3"),
  $buttonPrimaryColor: token.color("Button Primary Text", "#ffffff"),
  $buttonSecondaryBackground: token.color("Button Secondary Background", "#f5f5f5"),
  $buttonSecondaryColor: token.color("Button Secondary Text", "#333333"),
  $inputBackground: token.color("Input Background", "#ffffff"),
  $inputBorderColor: token.color("Input Border", "#cccccc"),
  $inputTextColor: token.color("Input Text", "#333333"),
  $inputPlaceholderColor: token.color("Input Placeholder", "#999999"),
};

// Main functions

/**
 * Defines design tokens by merging custom tokens with default tokens
 */
export function defineTokens(customTokens: TokensMap) {
  const mergedTokens: TokensMap = { ...defaultTokens };

  for (const [key, value] of Object.entries(customTokens)) {
    if (key.startsWith("$")) {
      throw new Error(`Custom token names cannot start with '$'. '${key}' is reserved for default tokens.`);
    }
    // If a custom token is defined, remove the corresponding default token (if it exists)
    const defaultKey = `$${key}`;
    if (defaultKey in mergedTokens) {
      delete mergedTokens[defaultKey];
    }
    mergedTokens[key] = value;
  }

  return resolveAliases(mergedTokens);
}

/**
 * Defines a theme with optional light and dark schemes
 */
export function defineTheme<T extends TokensMap>(tokens: T, theme: Theme<T>): Theme<T> {
  return theme;
}

type TokenNames<T extends TokensMap> = keyof T | `${string & keyof T}`;

type ComponentTokens<T extends TokensMap> = {
  [component: string]: {
    [K in keyof CSS.Properties]: TokenNames<T>;
  };
};

export function defineComponents<T extends TokensMap>(
  tokens: T,
  components: ComponentTokens<T>,
): { [K in keyof typeof components]: { [P in keyof (typeof components)[K]]: string } } {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const resolvedComponents: any = {};
  for (const [componentName, componentTokens] of Object.entries(components)) {
    resolvedComponents[componentName] = {};
    for (const [property, value] of Object.entries(componentTokens)) {
      resolvedComponents[componentName][property] = tokens[value as keyof T] || value;
    }
  }
  return resolvedComponents;
}

export const defaultComponents = defineComponents(defaultTokens, {
  button: {
    background: "$errorColor",
    color: "$surfaceColor",
  },
  input: {
    background: "$inputBackground",
    borderColor: "$inputBorderColor",
    color: "$inputTextColor",
  },
});

/**
 * Generates utility classes based on the defined tokens
 */
function generateUtilityClasses(tokens: TokensMap): string {
  let css = "";

  for (const [key, token] of Object.entries(tokens)) {
    switch (token.type) {
      case "color":
        css += `.${tokenNameToCSSClass(kebabCase(key))} { color: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-family":
        css += `.${tokenNameToCSSClass(kebabCase(key))} { font-family: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-size":
        css += `.${tokenNameToCSSClass(kebabCase(key))} { font-size: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-weight":
        css += `.${tokenNameToCSSClass(kebabCase(key))} { font-weight: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      // Add more cases for other token types as needed
    }
  }

  return css;
}

/**
 * Generates CSS for a set of tokens
 */
function generateTokenCSS(tokens: Record<string, string>, indent = ""): string {
  return Object.entries(tokens)
    .map(([key, value]) => {
      return `${indent}${tokenNameToCSSVar(key)}: ${value};`;
    })
    .join("\n");
}

/**
 * Converts a token name to a CSS variable name
 */
function tokenNameToCSSVar(name: string): string {
  return `--${name.startsWith("$") ? name.slice(1) : name}`;
}

function tokenNameToCSSClass(name: string): string {
  return `${name.startsWith("$") ? name.slice(1) : name}`;
}

/**
 * Generates CSS variables for all tokens and themes
 */

// Updated generateCSSVariables function
export function generateCSSVariables<T extends TokensMap>(
  tokens: T,
  themes: Record<string, Theme<T>>,
): string {
  let css = ":root {\n";

  // Generate CSS variables for all tokens
  const flattenedTokens = flattenObject(tokens);
  css += generateTokenCSS(flattenedTokens, "  ");
  css += "\n}\n\n";

  // Generate CSS variables for each theme
  for (const [themeName, theme] of Object.entries(themes)) {
    // Default theme values
    if (theme.default) {
      const flattenedTheme = flattenObject(theme.default);
      css += `[data-theme="${themeName}"] {\n`;
      css += generateTokenCSS(flattenedTheme, "  ");
      css += "\n}\n\n";
    }

    // Light scheme
    if (theme.light) {
      const flattenedLight = flattenObject(theme.light);
      css += `@media (prefers-color-scheme: light) {\n`;
      css += `  [data-theme="${themeName}"] {\n`;
      css += generateTokenCSS(flattenedLight, "    ");
      css += "  }\n";
      css += "}\n\n";
    }

    // Dark scheme
    if (theme.dark) {
      const flattenedDark = flattenObject(theme.dark);
      css += `@media (prefers-color-scheme: dark) {\n`;
      css += `  [data-theme="${themeName}"] {\n`;
      css += generateTokenCSS(flattenedDark, "    ");
      css += "  }\n";
      css += "}\n\n";
    }
  }

  // Generate utility classes
  css += "/* Utility Classes */\n";
  // for (const [key, value] of Object.entries(flattenedTokens)) {
  //   const camelKey = kebabToCamelCase(key);
  //   console.log("transforming key from %s to %s", key, camelKey);
  //   css += `.${camelKey} { ${key}: var(--${key}); }\n`;
  // }
  css += generateUtilityClasses(tokens);

  return css;
}

/**
 * Analyzes token usage to determine which tokens are using default values and which are customized
 */
export function analyzeTokenUsage(tokens: TokensMap): {
  usedDefaults: string[];
  customized: string[];
} {
  const usedDefaults = Object.keys(tokens).filter((key) => key.startsWith("$"));
  const customized = Object.keys(tokens).filter((key) => !key.startsWith("$"));
  return { usedDefaults, customized };
}

// Helper function to generate a color scale

function generateColorScale(baseColor: string, name: string, steps = 11) {
  const scale: Record<string, TokenColor> = {};
  const { hue, saturation, lightness } = parseToHsl(baseColor);

  for (let i = 0; i < steps; i++) {
    let stepNumber: number;
    let color: string;

    if (i === 0) {
      stepNumber = 50;
      color = hsl({
        hue,
        saturation: Math.min(saturation + 0.15, 1),
        lightness: Math.min(lightness + 0.55, 0.97),
      });
    } else if (i === steps - 1) {
      stepNumber = 950;
      color = hsl({
        hue,
        saturation: Math.min(saturation + 0.05, 1),
        lightness: Math.max(lightness - 0.55, 0.03),
      });
    } else {
      stepNumber = i * 100;
      const lightnessStep = (0.97 - 0.03) / (steps - 1);
      const newLightness = 0.97 - lightnessStep * i;
      const saturationAdjustment = (i / (steps - 1)) * 0.1;
      const hueAdjustment = (i / (steps - 1)) * 5;
      color = hsl({
        hue: (hue + hueAdjustment) % 360,
        saturation: Math.min(saturation + saturationAdjustment, 1),
        lightness: newLightness,
      });
    }

    const key = `${name}-${stepNumber}`;

    if (stepNumber === 500) {
      scale[`${name}`] = token.color(`${name.charAt(0).toUpperCase() + name.slice(1)}`, color);
    }

    scale[key] = token.color(`${name.charAt(0).toUpperCase() + name.slice(1)} ${stepNumber}`, color);
  }

  return scale;
}

// Function to generate a font size scale in rem
function generateFontSizeScale(
  baseSize = 16,
  scaleRatio = 1.25, // Major third scale
  steps = 8,
) {
  const scale: Record<string, TokenFontSize> = {};
  const smallerSizes = ["xs", "sm"];
  const biggerSizes = ["md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"];

  // Generate sizes smaller than the base
  for (let i = -2; i < 0; i++) {
    const size = modularScale(i, `${baseSize}px`, scaleRatio);
    const sizeInRem = rem(parseFloat(size), baseSize);
    let [value, unit] = getValueAndUnit(sizeInRem);
    value = parseFloat(value).toFixed(2);
    const name = smallerSizes[i + 2];
    scale[`text-${name}`] = token.fontSize(`Font Size ${name}`, `${value}${unit}`);
  }

  // Base size
  scale["text-base"] = token.fontSize("Base Font Size", "1rem");

  // Generate sizes larger than the base
  for (let i = 1; i <= steps; i++) {
    const size = modularScale(i, `${baseSize}px`, scaleRatio);
    const sizeInRem = rem(parseFloat(size), baseSize);
    let [value, unit] = getValueAndUnit(sizeInRem);
    value = parseFloat(value).toFixed(2);
    const name = biggerSizes[i - 1];
    scale[`text-${name}`] = token.fontSize(`Font Size ${name}`, `${value}${unit}`);
  }

  return scale;
}

function generateSizeScale(
  baseSize = 16, // Base size in pixels
  scaleRatio = 1.2, // Perfect fifth
  steps = 8, // Number of steps in the scale
) {
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

  return scale;
}
