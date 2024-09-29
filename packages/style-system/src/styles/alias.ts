import type { TokensMap, TokenAlias } from "./tokens";

export function resolveAliases(tokens: TokensMap) {
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
