import type { TSchema } from "@sinclair/typebox";
import ColorField from "./fields/color";
import { DimensionsField } from "./fields/dimensions";
import EnumField from "./fields/enum";
import ImageField from "./fields/image";
import RichTextField from "./fields/rich-text";
import { BorderField } from "./fields/border";
import { PathField, StringField } from "./fields/string";
import { NumberField, SliderField } from "./fields/number";
import SwitchField from "./fields/switch";
import { Fragment, type ReactNode } from "react";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import type { FieldProps } from "./fields/types";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import get from "lodash-es/get";
import type {
  BackgroundSettings,
  BorderSettings,
  DimensionsSettings,
  EffectsSettings,
  FlexSettings,
} from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { EffectsField } from "./fields/effects";
import type { ImageProps, RichText } from "@upstart.gg/sdk/shared/bricks/props/common";
import type { Attributes, JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import { PagePaddingField } from "./fields/padding";
import BackgroundField from "./fields/background";
import { FlexField } from "./fields/flex";

type FormComponent = { group: string; groupTitle: string; component: ReactNode };
type FormComponents = (FormComponent | { group: string; groupTitle: string; components: FormComponent[] })[];

type GetFormComponentsProps = {
  formSchema: JSONSchemaType<unknown>;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>, id: string) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  brickId: string;
  filter?: (field: unknown) => boolean;
  parents?: string[];
};
/**
 * Render a JSON schema form
 * @param schema the schema
 * @param formData data to prefill the form
 * @param onChange callback when the form changes
 * @param submitButtonLabel label for the submit button. If omitted, no submit button will be rendered
 * @param prefix prefix for deep fields
 */
export function getFormComponents({
  formSchema,
  formData,
  onChange,
  onSubmit,
  submitButtonLabel,
  brickId,
  filter,
  parents = [],
}: GetFormComponentsProps): FormComponents {
  formSchema = sortJsonSchemaProperties(formSchema);

  const elements = Object.entries(formSchema.properties)
    .filter(([, fieldSchema]) => (filter ? filter(fieldSchema) : true))
    .map(([fieldName, fieldSchema]) => {
      const field = fieldSchema as JSONSchemaType<unknown>;
      const id = parents.length ? `${parents.join(".")}.${fieldName}` : fieldName;
      const group = (field["ui:group"] ?? "other") as string;
      const groupTitle = (field["ui:group:title"] ?? "Other") as string;

      const commonProps = {
        brickId: id,
        schema: fieldSchema as TSchema,
        formSchema,
        formData,
        required: formSchema.properties.required?.includes(fieldName) ?? false,
        title: field.title ?? field["ui:title"],
        description: field.description ?? field["ui:description"],
        placeholder: field["ui:placeholder"],
      };

      const fieldType = (field["ui:field"] ?? field.type ?? (field.anyOf ? "anyOf" : "")) as string;

      switch (fieldType) {
        case "hidden": {
          return null;
        }
        case "color": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <ColorField
                currentValue={currentValue}
                onChange={(value?: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "border": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BorderSettings;
          return {
            group,
            groupTitle,
            component: (
              <BorderField
                currentValue={currentValue}
                onChange={(value: BorderSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "effects": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as EffectsSettings;
          return {
            group,
            groupTitle,
            component: (
              <EffectsField
                currentValue={currentValue}
                onChange={(value: EffectsSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "dimensions": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as DimensionsSettings;
          return {
            group,
            groupTitle,
            component: (
              <DimensionsField
                currentValue={currentValue}
                onChange={(value: DimensionsSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "flex": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as FlexSettings;
          return {
            group,
            groupTitle,
            component: (
              <FlexField
                currentValue={currentValue}
                onChange={(value: FlexSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "padding": {
          const currentValue = (get(formData, id) ??
            commonProps.schema.default) as Attributes["$pagePadding"];
          return {
            group,
            groupTitle,
            component: (
              <PagePaddingField
                currentValue={currentValue}
                onChange={(value: Attributes["$pagePadding"] | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "background": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BackgroundSettings;
          return {
            group,
            groupTitle,
            component: (
              <BackgroundField
                currentValue={currentValue}
                onChange={(value: BackgroundSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "enum": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <EnumField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "image": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as ImageProps;
          return {
            group,
            groupTitle,
            component: (
              <ImageField
                currentValue={currentValue}
                onChange={(value: ImageProps | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "rich-text": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as RichText;
          return {
            group,
            groupTitle,
            component: (
              <RichTextField
                currentValue={currentValue}
                onChange={(value: unknown | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "path": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <PathField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "slider": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          return {
            group,
            groupTitle,
            component: (
              <SliderField
                currentValue={currentValue}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "boolean":
        case "switch": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as boolean;
          return {
            group,
            groupTitle,
            component: (
              <SwitchField
                currentValue={currentValue}
                onChange={(value: boolean | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "string": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <StringField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "integer":
        case "number": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          return {
            group,
            groupTitle,
            component: (
              <NumberField
                currentValue={currentValue}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        // Complex type
        case "object": {
          // console.log("complex object", { field });
          return {
            group,
            groupTitle,
            components: getFormComponents({
              brickId,
              formSchema: field,
              formData,
              onChange,
              onSubmit,
              parents: [...parents, fieldName],
              submitButtonLabel,
            }).filter(Boolean),
          };
        }

        case "anyOf": {
          return {
            group,
            groupTitle,
            component: (
              <AnyOfField
                options={field.anyOf}
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: unknown | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        // React component
        case "Function":
          return null;

        default:
          console.warn("Unknown field type", { fieldType, field });
          return null;
      }
    })
    // filter null values
    .filter(Boolean);

  console.debug("Form elements for %s", brickId, elements);

  return elements as FormComponents;
}

export function FormRenderer({ components, brickId }: { components: FormComponents; brickId: string }) {
  let currentGroup: string | null = null;
  return components.map((element, index) => {
    const node = (
      <Fragment key={`${brickId}_${index}`}>
        {currentGroup !== element.group && element.groupTitle && (
          <h3
            className={tx(
              "text-sm font-semibold  !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
            )}
          >
            {element.groupTitle}
          </h3>
        )}
        <div className="form-group flex flex-col gap-3">
          {"component" in element
            ? element.component
            : element.components.map((c, i) => (
                <Fragment key={`${brickId}_${index}_comp_${i}`}>{c.component}</Fragment>
              ))}
        </div>
      </Fragment>
    );
    currentGroup = element.group;
    return node;
  });
}

export function AnyOfField(props: FieldProps<unknown>) {
  const {
    schema,
    onChange,
    formSchema: formContext,
    currentValue,
    title,
    description,
    options,
    brickId,
  } = props;

  const currentOpt = "foo";

  console.log("AnyOfField schema options", options);

  return (
    <>
      {title && (
        <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999] -mx-3">
          {title}
        </h3>
      )}
      Hello anyof
      <SegmentedControl.Root
        onValueChange={onChange}
        defaultValue={currentOpt}
        size="1"
        className="w-full !max-w-full mt-2"
        radius="full"
      >
        {(options as TSchema[])
          .filter((o) => !o["ui:hidden-option"])
          .map((option, index) => (
            <SegmentedControl.Item
              key={`${brickId}_${index}`}
              value={option.const}
              className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
            >
              {option.title}
            </SegmentedControl.Item>
          ))}
      </SegmentedControl.Root>
      {/* {options.map((option: any, index: number) => (
        <div key={`${id}_${index}`}>{option.title}</div>
      ))} */}
    </>
  );
}
