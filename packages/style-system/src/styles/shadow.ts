import { token } from "./token-helpers";

export const shadows = {
  // Shadows
  "shadow-sm": token.shadow(
    "Small Shadow",
    "0 0.0625rem 0.1875rem rgba(0,0,0,0.12), 0 0.0625rem 0.125rem rgba(0,0,0,0.24)",
  ),
  "shadow-md": token.shadow(
    "Medium Shadow",
    "0 0.1875rem 0.375rem rgba(0,0,0,0.15), 0 0.125rem 0.25rem rgba(0,0,0,0.12)",
  ),
  "shadow-lg": token.shadow(
    "Large Shadow",
    "0 0.625rem 1.25rem rgba(0,0,0,0.15), 0 0.1875rem 0.375rem rgba(0,0,0,0.10)",
  ),
  "shadow-xl": token.shadow(
    "X-Large Shadow",
    "0 1.25rem 2.5rem rgba(0,0,0,0.15), 0 0.375rem 0.625rem rgba(0,0,0,0.10)",
  ),
};
