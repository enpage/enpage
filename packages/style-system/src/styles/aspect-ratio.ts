import { token } from "./token-helpers";

export const aspectRatios = {
  "aspect-square": token.ratio("Square", "1/1"),
  "aspect-widescreen": token.ratio("Widescreen", "16/9"),
  "aspect-ultrawide": token.ratio("Ultrawide", "18/5"),
  "aspect-cinema": token.ratio("Cinema", "21/9"),
  "aspect-landscape": token.ratio("Landscape", "4/3"),
  "aspect-portrait": token.ratio("Portrait", "3/4"),
  "aspect-instagram": token.ratio("Instagram", "4/5"),
  "aspect-golden": token.ratio("Golden", "1.618/1"),
  "aspect-golden-vertical": token.ratio("Golden Vertical", "1/1.618"),
  "aspect-panorama": token.ratio("Panorama", "3/1"),
};
