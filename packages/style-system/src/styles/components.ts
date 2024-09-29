import type * as CSS from "csstype";
import type { TokenNames, TokensMap } from "./tokens";

export type ComponentTokens<T extends TokensMap> = {
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
