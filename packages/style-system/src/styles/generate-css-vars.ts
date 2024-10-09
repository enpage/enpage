import { generateTokenCSS, type TokensMap } from "./tokens";
import { flattenObject } from "./utils";
import { generateUtilityClasses } from "./classes";
import type { Theme } from "./theme";
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
