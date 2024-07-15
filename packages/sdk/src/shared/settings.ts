import z from "zod";

export const templateSettingsSchema = z.object({
  editorOutlineColor: z.string().optional(),
  logLevel: z.enum(["info", "warn", "error", "silent"]).optional(),
  clearScreen: z.boolean().optional(),
  disableTailwind: z.boolean().optional(),
});

export type TemplateSettings = z.infer<typeof templateSettingsSchema>;

const defaultTemplateSettings: TemplateSettings = {
  editorOutlineColor: "#8f93d8",
};

export function defineSettings(settings: TemplateSettings) {
  return {
    ...defaultTemplateSettings,
    ...settings,
  };
}
