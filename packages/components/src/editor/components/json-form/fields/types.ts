import type { TSchema } from "@sinclair/typebox";
import type { JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";

/**
 * Field props
 *
 * T: Field value type
 * F: All form fields data type
 */
export type FieldProps<T = unknown, F = Record<string, unknown>> = {
  brickId: Brick["id"];
  onChange: (value: T | null) => void;
  currentValue: T | undefined;
  /**
   * Field schema
   */
  schema: TSchema;
  /**
   * Full form schema
   */
  formSchema: JSONSchemaType<unknown>;
  /**
   * Form data
   */
  formData: F;
  required: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  /**
   * Used for anyOf/oneOf fields
   */
  options?: TSchema[];
};
