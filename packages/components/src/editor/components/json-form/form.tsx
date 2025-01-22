import type { TSchema } from "@sinclair/typebox";
import ColorField from "./fields/color";
import DimensionField from "./fields/dimension";
import EnumField from "./fields/enum";
import FileField from "./fields/file";
import MixedContentField from "./fields/mixed-content";
import { BorderField } from "./fields/border";
import { PathField, StringField } from "./fields/string";
import { NumberField, SliderField } from "./fields/number";
import SwitchField from "./fields/switch";
import { Fragment, type ReactNode } from "react";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import type { FieldProps } from "./fields/types";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@twind/core";
import type { BorderSettings, EffectsSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { EffectsField } from "./fields/effects";
import type { MixedContent } from "@upstart.gg/sdk/shared/bricks/props/common";

type FormComponent = { group: string; groupTitle: string; component: ReactNode };
type FormComponents = (FormComponent | { group: string; groupTitle: string; components: FormComponent[] })[];

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
  parents = [],
}: {
  formSchema: TSchema;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>, id: string) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  parents?: string[];
  /**
   * Related brick id.
   */
  brickId: string;
}): FormComponents {
  formSchema = sortJsonSchemaProperties(formSchema);

  const elements = Object.entries(formSchema.properties)
    .map(([fieldName, fieldSchema]) => {
      const field = fieldSchema as TSchema;
      const id = parents.length ? `${parents.join("_")}_${fieldName}` : fieldName;
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
          return {
            group,
            groupTitle,
            component: (
              <ColorField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "border": {
          return {
            group,
            groupTitle,
            component: (
              <BorderField
                currentValue={(formData[id] ?? commonProps.schema.default) as BorderSettings}
                onChange={(value: BorderSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "effects": {
          return {
            group,
            groupTitle,
            component: (
              <EffectsField
                currentValue={(formData[id] ?? commonProps.schema.default) as EffectsSettings}
                onChange={(value: EffectsSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "dimension": {
          return {
            group,
            groupTitle,
            component: (
              <DimensionField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "enum": {
          return {
            group,
            groupTitle,
            component: (
              <EnumField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "file": {
          return {
            group,
            component: (
              <FileField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "mixed-content": {
          return {
            group,
            groupTitle,
            component: (
              <MixedContentField
                currentValue={(formData[id] ?? commonProps.schema.default) as MixedContent}
                onChange={(value: unknown | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "path": {
          return {
            group,
            component: (
              <PathField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "slider": {
          return {
            group,
            groupTitle,
            component: (
              <SliderField
                currentValue={(formData[id] ?? commonProps.schema.default) as number}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "boolean":
        case "switch": {
          return {
            group,
            component: (
              <SwitchField
                currentValue={(formData[id] ?? commonProps.schema.default) as boolean}
                onChange={(value: boolean | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "string": {
          return {
            group,
            groupTitle,
            component: (
              <StringField
                currentValue={(formData[id] ?? commonProps.schema.default) as string}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "integer":
        case "number": {
          return {
            group,
            groupTitle,
            component: (
              <NumberField
                currentValue={(formData[id] ?? commonProps.schema.default) as number}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        // Complex type
        case "object": {
          console.log("complex object", { field });
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

        default:
          console.warn("Unknown field type", { fieldType, field });
          return null;
      }
    })
    // filter null values
    .filter(Boolean);

  return elements as FormComponents;
}

export function FormRenderer({ components, brickId }: { components: FormComponents; brickId: string }) {
  let currentGroup: string | null = null;
  return components.map((element, index) => {
    const node = (
      <Fragment key={`${brickId}_${index}`}>
        {currentGroup !== element.group && element.groupTitle && (
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999] -mx-3">
            {element.groupTitle}
          </h3>
        )}
        <div className="form-group flex flex-col gap-3">
          {"component" in element ? element.component : element.components.map((c, i) => c.component)}
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
