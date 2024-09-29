import type * as CSS from "csstype";
import type { TokenColor, TokenFontSize, TokenSize, TokensMap, Theme } from "./types";
import { flattenObject } from "./flattenObject";
import { kebabCase } from "./kebabCase";
import { token } from "./token-helpers";
import { resolveAliases } from "./resolveAliases";
import { fontSizeScale } from "./font-size";
import { sizeScale } from "./size";
import { colors } from "./colors";

/**
 * Default tokens used as a base for the design system
 */
const defaultTokens = {
  ...colors,
  ...fontSizeScale,
  ...sizeScale,
  // Colors (unchanged, as colors don't use units)
  primaryColor: token.color("Primary Color", "#0070f3"),
  secondaryColor: token.color("Secondary Color", "#ff4081"),
  accentColor: token.color("Accent Color", "#00c853"),
  backgroundColor: token.color("Background Color", "#ffffff"),
  surfaceColor: token.color("Surface Color", "#f5f5f5"),
  textColor: token.color("Text Color", "#333333"),
  textPrimaryColor: token.color("Primary Text Color", "#333333"),
  textSecondaryColor: token.color("Secondary Text Color", "#666666"),
  linkColor: token.color("Link Color", "#0070f3"),
  successColor: token.color("Success Color", "#4caf50"),
  warningColor: token.color("Warning Color", "#ff9800"),
  errorColor: token.color("Error Color", "#f44336"),

  // Typography
  fontHeading: token.fontFamily(
    "Heading Font",
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  ),
  fontBody: token.fontFamily(
    "Body Font",
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  ),
  fontWeightNormal: token.fontWeight("Normal Font Weight", "400"),
  fontWeightBold: token.fontWeight("Bold Font Weight", "700"),
  lineHeightBase: token.fontFamily("Base Line Height", "1.5"),

  // Spacing
  spacingXSmall: token.spacing("Extra Small Spacing", "0.25rem"),
  spacingSmall: token.spacing("Small Spacing", "0.5rem"),
  spacingMedium: token.spacing("Medium Spacing", "1rem"),
  spacingLarge: token.spacing("Large Spacing", "1.5rem"),
  spacingXLarge: token.spacing("Extra Large Spacing", "2rem"),

  // Border
  borderRadiusSmall: token.borderRadius("Small Border Radius", "0.125rem"),
  borderRadiusMedium: token.borderRadius("Medium Border Radius", "0.25rem"),
  borderRadiusLarge: token.borderRadius("Large Border Radius", "0.5rem"),
  borderWidthThin: token.borderWidth("Thin Border Width", "1px"),
  borderWidthMedium: token.borderWidth("Medium Border Width", "2px"),
  borderWidthThick: token.borderWidth("Thick Border Width", "4px"),

  // Shadows
  shadowSmall: token.shadow(
    "Small Shadow",
    "0 0.0625rem 0.1875rem rgba(0,0,0,0.12), 0 0.0625rem 0.125rem rgba(0,0,0,0.24)",
  ),
  shadowMedium: token.shadow(
    "Medium Shadow",
    "0 0.1875rem 0.375rem rgba(0,0,0,0.15), 0 0.125rem 0.25rem rgba(0,0,0,0.12)",
  ),
  shadowLarge: token.shadow(
    "Large Shadow",
    "0 0.625rem 1.25rem rgba(0,0,0,0.15), 0 0.1875rem 0.375rem rgba(0,0,0,0.10)",
  ),

  // Layout
  containerMaxWidth: token.size("Container Max Width", "75rem"),
  breakpointMobile: token.size("Mobile Breakpoint", "480px"),
  breakpointTablet: token.size("Tablet Breakpoint", "768px"),
  breakpointDesktop: token.size("Desktop Breakpoint", "1367px"),

  // Components
  buttonPrimaryBackground: token.color("Button Primary Background", "#0070f3"),
  buttonPrimaryColor: token.color("Button Primary Text", "#ffffff"),
  buttonSecondaryBackground: token.color("Button Secondary Background", "#f5f5f5"),
  buttonSecondaryColor: token.color("Button Secondary Text", "#333333"),
  inputBackground: token.color("Input Background", "#ffffff"),
  inputBorderColor: token.color("Input Border", "#cccccc"),
  inputTextColor: token.color("Input Text", "#333333"),
  inputPlaceholderColor: token.color("Input Placeholder", "#999999"),
};

// Main functions

/**
 * Defines design tokens by merging custom tokens with default tokens
 */
export function defineTokens(customTokens: TokensMap) {
  const mergedTokens: TokensMap = { ...defaultTokens };

  for (const [key, value] of Object.entries(customTokens)) {
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
    background: "errorColor",
    color: "surfaceColor",
  },
  input: {
    background: "inputBackground",
    borderColor: "inputBorderColor",
    color: "inputTextColor",
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
        css += `.${kebabCase(key)} { color: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-family":
        css += `.${kebabCase(key)} { font-family: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-size":
        css += `.${kebabCase(key)} { font-size: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-weight":
        css += `.${kebabCase(key)} { font-weight: var(${tokenNameToCSSVar(key)}); }\n`;
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
  return `--${name}`;
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
