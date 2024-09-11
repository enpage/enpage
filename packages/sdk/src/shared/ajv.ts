import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export const ajv = new Ajv({
  useDefaults: true,
});

// Add formats to Ajv
addFormats(ajv);

ajv.addFormat("date-object", {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validate: (data: any) => data instanceof Date && !Number.isNaN(data.getTime()),
  async: false,
});

export function serializeAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return "Unknown validation error";
  }
  return errors
    .map((error) => {
      const { instancePath, message, params } = error;
      const path = instancePath || "root";
      const details = Object.entries(params || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      return `${path} ${message} (${details})`;
    })
    .join("; ");
}
