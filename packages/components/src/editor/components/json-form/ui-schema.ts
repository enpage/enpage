import type { UiSchema } from "@rjsf/utils";
import type { AnySchemaObject } from "@upstart.gg/sdk/shared/ajv";

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

export function createUiSchema(schema: AnySchemaObject): UiSchema {
  // console.log("original schema", schema);
  const uiSchema = Object.entries(schema.properties).reduce(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (acc, [field, value]: [string, any]) => {
      // console.log("uischema: field", field, "value", value, "baseSchema", schema);
      for (const key in value) {
        if (key.startsWith("ui:")) {
          acc[field] ??= {};
          acc[field][key] = value[key];
        } else if (key === "properties") {
          // console.log("INPROP", value, "field", field);
          const deepUi = createUiSchema(value);
          acc[field] ??= {};
          for (const deepKey in deepUi) {
            acc[field][deepKey] = deepUi[deepKey];
          }
        } else if (key === "anyOf") {
          // console.log("INPROP ANYOF", value, "field", field);
          // Prevent rsjv to display a label as we want to format it ourselves
          acc[field] ??= {};
          acc[field]["ui:label"] = false;

          // console.log("branch", field, key, value[key]);
        }
      }
      return acc;
    },
    { ...baseUiSchema } as UiSchema,
  );

  return uiSchema;
}

// export function createUiSchema(schema: AnySchemaObject): UiSchema {
//   const uiSchema: UiSchema = {};

//   function processProperties(properties: Record<string, any>, parentPath = ""): void {
//     Object.entries(properties).forEach(([field, value]) => {
//       const currentPath = parentPath ? `${parentPath}.${field}` : field;

//       // Handle UI properties
//       const uiProps = Object.entries(value).reduce(
//         (acc, [key, val]) => {
//           if (key.startsWith("ui:")) {
//             acc[key] = val;
//           }
//           return acc;
//         },
//         {} as Record<string, any>,
//       );

//       if (Object.keys(uiProps).length > 0) {
//         uiSchema[currentPath] = uiProps;
//       }

//       // Recursively process nested properties
//       if (value.properties) {
//         processProperties(value.properties, currentPath);
//       }

//       // Handle arrays with items that have properties
//       if (value.items?.properties) {
//         processProperties(value.items.properties, `${currentPath}.items`);
//       }
//     });
//   }

//   if (schema.properties) {
//     processProperties(schema.properties);
//   }

//   return { ...baseUiSchema, ...uiSchema };
// }
