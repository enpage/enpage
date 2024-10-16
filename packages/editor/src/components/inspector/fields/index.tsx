import type { RegistryFieldsType } from "@rjsf/utils";
import EnumField from "./enum";
import FileField from "./file";
import DimensionField from "./dimension";

export const customFields: RegistryFieldsType = {
  enum: EnumField,
  file: FileField,
  dimension: DimensionField,
};
