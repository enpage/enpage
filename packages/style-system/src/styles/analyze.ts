import type { TokensMap } from "./tokens";
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
