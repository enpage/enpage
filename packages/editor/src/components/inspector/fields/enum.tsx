import type { FieldProps } from "@rjsf/utils";
import { Fragment } from "react";
import clsx from "clsx";

interface EnumOption {
  const: string;
  title: string;
  description: string;
  icon: string;
}

const EnumField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required } = props;

  // Extract options from the schema
  const options: EnumOption[] =
    (schema.anyOf ?? schema.oneOf)?.map((option: any) => ({
      const: option.const,
      title: option.title || option.const,
      description: option.description || "",
      icon: option.icon || "",
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
                    checked={formData === option.const}
                    onChange={() => onChange(option.const)}
                    required={required}
                    className="form-radio mr-1 text-primary-600 ring-primary-600 focus:ring-transparent"
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
          <div className="flex divide-x divide-white dark:divide-dark-500">
            {options.map((option) => (
              <button
                key={option.const}
                type="button"
                className={clsx(`text-sm first:rounded-l last:rounded-r py-0.5 flex-1`, {
                  "bg-primary-600 text-white": formData === option.const,
                  "bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-800 dark:text-white/50":
                    formData !== option.const,
                })}
                onClick={() => onChange(option.const)}
              >
                {option.title}
              </button>
            ))}
          </div>
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
                    "bg-primary-600 text-white": formData === option.const,
                    "bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-500 dark:text-white/50":
                      formData !== option.const,
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

    case "select":
      return (
        <div className="enum-field">
          {fieldTitle && <label className="control-label">{fieldTitle}</label>}
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          <select
            className="form-select"
            value={formData}
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

  return (
    <div className="enum-field">
      {fieldTitle && <label className="control-label">{fieldTitle}</label>}
      {fieldDescription && <p className="field-description">{fieldDescription}</p>}
      {options.map((option) => (
        <div key={option.const} className="radio">
          <label>
            <input
              type="radio"
              value={option.const}
              checked={formData === option.const}
              onChange={() => onChange(option.const)}
              required={required}
            />
            {option.title}
          </label>
          {option.description && <p className="help-block">{option.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default EnumField;
