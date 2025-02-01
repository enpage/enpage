import type { RegistryFieldsType } from "@rjsf/utils";
import type EnumField from "./enum";
import type ImageField from "./image";
import ColorField from "./color";
import type SwitchField from "./switch";
import type MixedContentField from "./mixed-content";
import { type FC, ReactNode } from "react";
import type { FieldProps } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const customFields: Record<string, FC<FieldProps<any>>> = {
  // enum: EnumField,
  // file: FileField,
  // dimension: DimensionField,
  color: ColorField,
  // slider: SliderField,
  // switch: SwitchField,
  // path: PathField,
  // AnyOfField: MyAnyOfField,
  // "mixed-content": MixedContentField,
  // ObjectField: ObjectField,
};
