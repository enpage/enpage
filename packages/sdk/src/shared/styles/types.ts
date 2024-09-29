import type { ResponsiveMode } from "../responsive";

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
    : T[K] extends Record<string, any>
      ? TokenStructure<T[K]>
      : never;
};
// Define the Theme type

export type Theme<T> = {
  default: Partial<TokenStructure<T>>;
  light?: Partial<TokenStructure<T>>;
  dark?: Partial<TokenStructure<T>>;
};
