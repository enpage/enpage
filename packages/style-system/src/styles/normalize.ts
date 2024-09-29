import type * as CSS from "csstype";
import type { TokenNames, TokensMap } from "./tokens";

type Selectors<T extends TokensMap> = {
  [selector: string]: {
    [K in keyof CSS.PropertiesHyphen]: `var(--${string & TokenNames<T>})` | CSS.PropertiesHyphen[K];
  };
};

type PseudoSelectors<T extends TokensMap> = {
  [selector: string]: {
    [P in CSS.SimplePseudos]?: {
      [K in keyof CSS.PropertiesHyphen]: `var(--${string & TokenNames<T>})` | CSS.PropertiesHyphen[K];
    };
  };
};

export type NormalizeTokens<T extends TokensMap> = Selectors<T> & PseudoSelectors<T>;

export function defineNormalize<T extends TokensMap>(
  tokens: T,
  normalizedSelectors: NormalizeTokens<T>,
): { [K in keyof typeof normalizedSelectors]: { [P in keyof (typeof normalizedSelectors)[K]]: string } } {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const resolvedComponents: any = {};
  for (const [selector, componentTokens] of Object.entries(normalizedSelectors)) {
    resolvedComponents[selector] = {};
    for (const [property, value] of Object.entries(componentTokens)) {
      resolvedComponents[selector][property] = tokens[value as keyof T] || value;
    }
  }
  return resolvedComponents;
}
