import { defaultTokens } from "./default/default-tokens";
import { resolveAliases } from "./alias";

// Base interfaces
export interface BaseToken {
  name: string;
  group?: string;
  advanced?: boolean;
}

// Token types

export interface TokenColor extends BaseToken {
  type: "color";
  value: string;
}

export interface TokenFontFamily extends BaseToken {
  type: "font-family";
  value: string;
}

export interface TokenFontSize extends BaseToken {
  type: "font-size";
  value: string;
}

export interface TokenFontWeight extends BaseToken {
  type: "font-weight";
  value: string;
}

export interface TokenLineHeight extends BaseToken {
  type: "line-height";
  value: string;
}

export interface TokenSize extends BaseToken {
  type: "size";
  value: string;
}

export interface TokenRatio extends BaseToken {
  type: "ratio";
  value: string;
}

export interface TokenSpacing extends BaseToken {
  type: "spacing";
  value: string;
}

export interface TokenBorderRadius extends BaseToken {
  type: "border-radius";
  value: string;
}

export interface TokenBorderWidth extends BaseToken {
  type: "border-width";
  value: string;
}

export interface TokenBorderStyle extends BaseToken {
  type: "border-style";
  value: string;
}

export interface TokenShadow extends BaseToken {
  type: "shadow";
  value: string;
}

export interface TokenAlias extends BaseToken {
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
  | TokenBorderStyle
  | TokenShadow
  | TokenRatio
  | TokenLineHeight
  | TokenAlias;

export type TokensMap = {
  [key: string]: Token;
};

export type ResolvedTokensMap = {
  [K in keyof TokensMap]: TokensMap[K]["value"];
};

export type TokenNames<T extends TokensMap> = keyof T | `${string & keyof T}`;

// Theme type
// export type ThemeValues = {
//   [key: string]: string;
// };

// Helper type to extract the value type from a Token
type TokenValue<T> = T extends Token ? T["value"] : never;
// Helper type to check if a type is a Token or a nested structure
type IsToken<T> = T extends Token ? true : false;

// Create a type that represents the structure of our tokens
export type TokenStructure<T> = {
  [K in keyof T]: IsToken<T[K]> extends true
    ? TokenValue<T[K]>
    : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      T[K] extends Record<string, any>
      ? TokenStructure<T[K]>
      : never;
};

/**
 * Converts a token name to a CSS variable name
 */
export function tokenNameToCSSVar(name: string): string {
  return `--${name}`;
}

/**
 * Generates CSS for a set of tokens
 */
export function generateTokenCSS(tokens: Record<string, string>, indent = ""): string {
  return Object.entries(tokens)
    .map(([key, value]) => {
      return `${indent}${tokenNameToCSSVar(key)}: ${value};`;
    })
    .join("\n");
}

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
