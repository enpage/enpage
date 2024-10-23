import type { FieldProps } from "@rjsf/utils";
import { SegmentedControl, Slider } from "@enpage/style-system";
import clsx from "clsx";
import { tx } from "@enpage/sdk/browser/twind";
import { BiMinus } from "react-icons/bi";

interface EnumOption {
  const: string;
  title: string;
  description: string;
  icon: string;
}

const EnumField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData: currentValue, onChange, required } = props;

  // Extract options from the schema
  const options: EnumOption[] =
    (schema.anyOf ?? schema.oneOf)?.map((option: any) => ({
      const: option.const,
      title: option.title || option.const,
      description: option.description || "",
      icon: option.icon || "",
      min: option.minimum,
      max: option.maximum,
    })) || [];

  const displayAs: "select" | "radio" | "button-group" | "icon-group" =
    schema["ui:display"] ?? (options.length > 3 ? "select" : "button-group");

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  switch (displayAs) {
    case "radio":
      return (
        <div className="enum-field">
          {fieldTitle && (
            <label className="control-label">
              {fieldTitle}
              {required ? <span className="required">*</span> : null}
            </label>
          )}
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={option.const} className="">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value={option.const}
                    checked={currentValue === option.const}
                    onChange={onChange(option.const)}
                    required={required}
                    className="form-radio mr-1 text-upstart-600 ring-upstart-600 focus:ring-transparent"
                  />
                  <span className="font-medium">{option.title}</span>
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500 leading-tight select-none">{option.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "button-group":
      return (
        <div className="enum-field">
          {fieldTitle && <label className="control-label">{fieldTitle}</label>}
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          <SegmentedControl.Root
            onValueChange={onChange}
            defaultValue={currentValue}
            size="1"
            className="w-full !max-w-full"
            radius="full"
          >
            {options.map((option) => (
              <SegmentedControl.Item
                key={option.const}
                value={option.const}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.title}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      );

    case "icon-group":
      return (
        <div className="enum-field">
          {fieldTitle && <label className="control-label">{fieldTitle}</label>}
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          <div className="flex divide-x divide-white dark:divide-dark-500">
            {options.map((option) => (
              <button
                key={option.const}
                type="button"
                className={clsx(
                  `text-sm first:rounded-l last:rounded-r py-0.5 flex-1 flex items-center justify-center`,
                  {
                    "bg-upstart-600 text-white": currentValue === option.const,
                    "bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-500 dark:text-white/50":
                      currentValue !== option.const,
                  },
                )}
                onClick={() => onChange(option.const)}
              >
                <span
                  className="w-7 h-7 p-0.5"
                  /* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */
                  dangerouslySetInnerHTML={{ __html: option.icon }}
                />
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="enum-field">
          {fieldTitle && <label className="control-label">{fieldTitle}</label>}
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          <select
            className="form-select"
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          >
            {options.map((option) => (
              <option key={option.const} value={option.const}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
      );
  }
};

export default EnumField;
