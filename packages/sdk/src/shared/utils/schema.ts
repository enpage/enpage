import type { TObject } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function typeboxSchemaToJSONSchema<T extends Record<string, any>>(schema: TObject): JSONSchemaType<T> {
  return JSON.parse(JSON.stringify(schema));
}
