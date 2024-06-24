import z from "zod";

export const templateSettingsSchema = z.object({
  disableTailwind: z.boolean().optional(),
  outlineColor: z.string().optional(),
});

export type TemplateSettings = z.infer<typeof templateSettingsSchema>;
