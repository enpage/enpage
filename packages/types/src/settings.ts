import z from "zod";

export const templateSettingsSchema = z.object({
  editorOutlineColor: z.string().optional(),
});

export type TemplateSettings = z.infer<typeof templateSettingsSchema>;
