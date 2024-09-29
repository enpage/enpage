import type { TokensMap, TokenStructure } from "./tokens";

// Define the Theme type
export type Theme<T> = {
  default: Partial<TokenStructure<T>>;
  light?: Partial<TokenStructure<T>>;
  dark?: Partial<TokenStructure<T>>;
};

/**
 * Defines a theme with optional light and dark schemes
 */
export function defineTheme<T extends TokensMap>(tokens: T, theme: Theme<T>): Theme<T> {
  return theme;
}
