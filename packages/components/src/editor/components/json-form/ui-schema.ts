import type { UiSchema } from "@rjsf/utils";
import type { TObject } from "@sinclair/typebox";

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

export function createUiSchema(baseSchema: TObject): UiSchema {
  const uiSchema = Object.entries(baseSchema.properties).reduce((acc, [field, value]) => {
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
