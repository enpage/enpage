import z from "zod";

export const responsiveMode = z.enum(["mobile", "tablet", "desktop"]);
export type ResponsiveMode = z.infer<typeof responsiveMode>;
