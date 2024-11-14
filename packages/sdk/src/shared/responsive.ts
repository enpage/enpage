import z from "zod";

export const responsiveMode = z.enum(["mobile", "desktop"]);
export type ResponsiveMode = z.infer<typeof responsiveMode>;
