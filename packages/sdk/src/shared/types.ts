import z from "zod";

export const responsiveMode = z.enum(["mobile", "tablet", "desktop"]);
export type ResponsiveMode = z.infer<typeof responsiveMode>;

export type Customization =
  | "none"
  | "all"
  | "background"
  | "size"
  | "spacing"
  | "border"
  | "shadow"
  | "typography"
  | "position"
  | "direction"
  | "opacity"
  | "transform"
  | "animation";
