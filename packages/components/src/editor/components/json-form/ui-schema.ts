import type { UiSchema } from "@rjsf/utils";
import type { AnySchemaObject } from "@upstart.gg/sdk/shared/ajv";

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

export function createUiSchema(baseSchema: AnySchemaObject): UiSchema {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const uiSchema = Object.entries(baseSchema.properties).reduce((acc, [field, value]: [string, any]) => {
    for (const key in value) {
      if (key.startsWith("ui:")) {
        acc[field] ??= {};
        acc[field][key] = value[key];
      }
    }
    return acc;
  }, baseUiSchema as UiSchema);

  return uiSchema;
}
