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

export interface TokenTypography extends BaseToken, Responsive<string> {
  type: "typography";
  value: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
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

export type Token =
  | TokenColor
  | TokenTypography
  | TokenSize
  | TokenSpacing
  | TokenBorderRadius
  | TokenBorderWidth
  | TokenShadow;

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

export type Theme = {
  default: ThemeValues;
  light?: ThemeValues;
  dark?: ThemeValues;
};

// Helper functions
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Token creation helpers
export const token = {
  color(name: string, value: string, opts?: Omit<TokenColor, "name" | "type" | "value">): TokenColor {
    return { type: "color", name, value, ...opts };
  },
  typography(
    name: string,
    value: string,
    opts?: Omit<TokenTypography, "name" | "type" | "value">,
  ): TokenTypography {
    return { type: "typography", name, value, ...opts };
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
};

/**
 * Default tokens used as a base for the design system
 */
const defaultTokens = defineTokens({
  // Colors (unchanged, as colors don't use units)
  $primaryColor: token.color("Primary Color", "#0070f3"),
  $secondaryColor: token.color("Secondary Color", "#ff4081"),
  $accentColor: token.color("Accent Color", "#00c853"),
  $backgroundColor: token.color("Background Color", "#ffffff"),
  $surfaceColor: token.color("Surface Color", "#f5f5f5"),
  $textColorPrimary: token.color("Primary Text Color", "#333333"),
  $textColorSecondary: token.color("Secondary Text Color", "#666666"),
  $linkColor: token.color("Link Color", "#0070f3"),
  $successColor: token.color("Success Color", "#4caf50"),
  $warningColor: token.color("Warning Color", "#ff9800"),
  $errorColor: token.color("Error Color", "#f44336"),

  // Typography
  $headingFont: token.typography("Heading Font", "Arial, sans-serif"),
  $bodyFont: token.typography("Body Font", "Arial, sans-serif"),
  $fontSizeBase: token.size("Base Font Size", "1rem"),
  $fontSizeSmall: token.size("Small Font Size", "0.875rem"),
  $fontSizeLarge: token.size("Large Font Size", "1.125rem"),
  $fontWeightNormal: token.typography("Normal Font Weight", "400"),
  $fontWeightBold: token.typography("Bold Font Weight", "700"),
  $lineHeightBase: token.typography("Base Line Height", "1.5"),

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
  $buttonPrimaryText: token.color("Button Primary Text", "#ffffff"),
  $buttonSecondaryBackground: token.color("Button Secondary Background", "#f5f5f5"),
  $buttonSecondaryText: token.color("Button Secondary Text", "#333333"),
  $inputBackground: token.color("Input Background", "#ffffff"),
  $inputBorder: token.color("Input Border", "#cccccc"),
  $inputText: token.color("Input Text", "#333333"),
  $inputPlaceholder: token.color("Input Placeholder", "#999999"),
});

// Main functions

/**
 * Defines design tokens by merging custom tokens with default tokens
 */
export function defineTokens(customTokens: TokensMap): TokensMap {
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

  return mergedTokens;
}

/**
 * Defines a theme with optional light and dark schemes
 */
export function defineTheme(theme: Theme): Theme {
  return theme;
}

type ComponentTokens<T extends ResolvedTokensMap> = {
  [component: string]: {
    [property: string]: keyof T | string;
  };
};

export function defineComponents<T extends ResolvedTokensMap>(
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

/**
 * Generates utility classes based on the defined tokens
 */
function generateUtilityClasses(tokens: TokensMap): string {
  let css = "";

  for (const [key, token] of Object.entries(tokens)) {
    switch (token.type) {
      case "color":
        css += `.text-color-${tokenNameToCSSVar(kebabCase(key))} { color: var(--${tokenNameToCSSVar(kebabCase(key))}); }\n`;
        css += `.bg-color-${tokenNameToCSSVar(kebabCase(key))} { background-color: var(--${tokenNameToCSSVar(kebabCase(key))}); }\n`;
        break;
      case "typography":
        css += `.font-${tokenNameToCSSVar(kebabCase(key))} { font-family: var(--${tokenNameToCSSVar(kebabCase(key))}); }\n`;
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
    .map(([key, value]) => `${indent}--${tokenNameToCSSVar(kebabCase(key))}: ${value};`)
    .join("\n");
}

/**
 * Generates CSS for a specific color scheme within a theme
 */
function generateSchemeCSS(
  themeName: string,
  scheme: ThemeValues,
  schemeName: string,
  tokens: TokensMap,
): string {
  const schemeTokens = Object.entries(scheme).reduce(
    (acc, [key, value]) => {
      if (!(key in tokens)) {
        throw new Error(`Theme "${themeName}" ${schemeName} scheme contains unknown token "${key}"`);
      }
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `[data-theme="${themeName}"] {
  @media (prefers-color-scheme: ${schemeName}) {
${generateTokenCSS(schemeTokens, "    ")}
  }
}`;
}

/**
 * Converts a token name to a CSS variable name
 */
function tokenNameToCSSVar(name: string): string {
  return `--${name.startsWith("$") ? name.slice(1) : name}`;
}

/**
 * Generates CSS variables for all tokens and themes
 */
export function generateCSSVariables(tokens: TokensMap, themes: Record<string, Theme>): string {
  let css = `:root {\n${generateTokenCSS(Object.fromEntries(Object.entries(tokens).map(([key, token]) => [key, token.value])), "  ")}\n}\n\n`;
  for (const [themeName, theme] of Object.entries(themes)) {
    // Default theme values
    css += `[data-theme="${themeName}"] {\n${generateTokenCSS(theme.default, "  ")}\n}\n\n`;
    // Light scheme
    if (theme.light) {
      css += `${generateSchemeCSS(themeName, theme.light, "light", tokens)}\n\n`;
    }
    // Dark scheme
    if (theme.dark) {
      css += `${generateSchemeCSS(themeName, theme.dark, "dark", tokens)}\n\n`;
    }

    // Add utility classes
    css += "\n/* Utility Classes */\n";
    css += generateUtilityClasses(tokens);
  }
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
