import type { RegistryFieldsType } from "@rjsf/utils";
import EnumField from "./enum";
import FileField from "./file";
import DimensionField from "./dimension";
import ColorField from "./color";
import SliderField from "./slider";
import SwitchField from "./switch";
import PathField from "./path";

export const customFields: RegistryFieldsType = {
  enum: EnumField,
  file: FileField,
  dimension: DimensionField,
  color: ColorField,
  slider: SliderField,
  switch: SwitchField,
  path: PathField,
};
