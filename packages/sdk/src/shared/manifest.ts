import z from "zod";

const templateSettingsSchema = z.object({
  editorOutlineColor: z.string().optional(),
  disableTailwind: z.boolean().optional(),
  disableBodyCustomization: z.boolean().optional(),
});

type TemplateSettings = z.infer<typeof templateSettingsSchema>;

const defaultTemplateSettings: TemplateSettings = {
  editorOutlineColor: "#8f93d8",
};

export const templateManifestSchema = z.object({
  // if ommitted, it smeans the template has not been published yet
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  author: z.string(),
  thumbnail: z.string().url().optional(),
  homepage: z.string().url().optional(),
  settings: templateSettingsSchema.optional(),
});

export type TemplateManifest = z.infer<typeof templateManifestSchema>;

export function defineManifest(manifest: TemplateManifest) {
  manifest.settings = { ...defaultTemplateSettings, ...(manifest.settings ?? {}) };
  return manifest;
}
