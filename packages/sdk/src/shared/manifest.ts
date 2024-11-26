import z from "zod";

export const templateManifestSchema = z.object({
  // if ommitted, it means the template has not been published yet
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  // indexed by language code
  readme: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string(),
  thumbnail: z.string().url().optional(),
  homepage: z.string().url().optional(),
});

export type TemplateManifest = z.infer<typeof templateManifestSchema>;
export type PublishedTemplateManifest = TemplateManifest & Required<Pick<TemplateManifest, "id">>;

export function defineManifest(manifest: Omit<TemplateManifest, "id" | "thumbnail">): TemplateManifest {
  return manifest;
}
