import type { TSchema } from "@sinclair/typebox";

/**
 * Field props
 *
 * T: Field value type
 * F: All form fields data type
 */
export type FieldProps<T = unknown, F = Record<string, unknown>> = {
  id: string;
  onChange: (value: T | null) => void;
  currentValue: T;
  /**
   * Field schema
   */
  schema: TSchema;
  /**
   * Full form schema
   */
  formSchema: TSchema;
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
