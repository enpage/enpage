import type {
  TokenColor,
  TokenFontFamily,
  TokenFontSize,
  TokenFontWeight,
  TokenSize,
  TokenSpacing,
  TokenBorderRadius,
  TokenBorderWidth,
  TokenShadow,
  TokenAlias,
} from "./types";

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
