import { token } from "./token-helpers";
import type { TokenFontWeight } from "./tokens";

const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const fontWeights: Record<string, TokenFontWeight> = {};

for (const weight of weights) {
  fontWeights[`font-weight-${weight}`] = token.fontWeight(`Font Weight ${weight}`, `${weight}`);
}

export { fontWeights };
