import z from "zod";

export const templateManifest = z.object({
  id: z.string(),
  version: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  author: z.string(),
  thumbnail: z.string().url(),
  homepage: z.string().url().optional(),
});

export type TemplateManifest = z.infer<typeof templateManifest>;

export function defineManifest(manifest: TemplateManifest): TemplateManifest {
  return manifest;
}
