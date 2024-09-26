import { z } from "zod";
import { defaults as epHeading } from "./ep-heading";
import { defaults as epImage } from "./ep-image";
import { defaults as epText } from "./ep-text";

export const blockTypes = z.enum([epHeading.type, epImage.type, epText.type]);

export type BlockType = z.infer<typeof blockTypes>;
