import { z } from "zod";

export const blockTypes = z.enum([
  "text",
  "heading",
  "image",
  "video",
  "icon",
  "container",
  "button",
  "vertical-spacer",
]);

export type BlockType = z.infer<typeof blockTypes>;
