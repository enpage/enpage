import { token } from "./token-helpers";

export const borderWidth = {
  "border-px": token.borderWidth("Border Width", "1px"),
  "border-sm": token.borderWidth("Small Border Width", "2px"),
  "border-md": token.borderWidth("Medium Border Width", "4px"),
  "border-lg": token.borderWidth("Large Border Width", "8px"),
  "border-xl": token.borderWidth("X-Large Border Width", "16px"),
};

export const borderRadius = {
  "radius-sm": token.borderRadius("Small Border Radius", "0.125rem"),
  "radius-md": token.borderRadius("Medium Border Radius", "0.25rem"),
  "radius-lg": token.borderRadius("Large Border Radius", "0.5rem"),
  "radius-xl": token.borderRadius("X-Large Border Radius", "0.75rem"),
  "radius-2xl": token.borderRadius("2X-Large Border Radius", "1rem"),
  "radius-3xl": token.borderRadius("3X-Large Border Radius", "1.5rem"),
  "radius-full": token.borderRadius("Full Border Radius", "9999px"),
};

export const borderStyles = {
  "border-solid": token.borderStyle("Solid Border Style", "solid"),
  "border-dashed": token.borderStyle("Dashed Border Style", "dashed"),
  "border-dotted": token.borderStyle("Dotted Border Style", "dotted"),
  "border-double": token.borderStyle("Double Border Style", "double"),
  "border-none": token.borderStyle("None Border Style", "none"),
};
