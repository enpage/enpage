import z from "zod";

export const templateSettingsSchema = z.object({
  editorOutlineColor: z.string().optional(),
  logLevel: z.enum(["info", "warn", "error", "silent"]).optional(),
  clearScreen: z.boolean().optional(),
});

export type TemplateSettings = z.infer<typeof templateSettingsSchema>;
