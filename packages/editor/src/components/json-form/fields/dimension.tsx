import type { FieldProps } from "@rjsf/utils";
import { tx } from "@enpage/style-system/twind";
import { useEffect, useState } from "react";

interface DimensionOption {
  title: string;
  description: string;
}

const DimensionField: React.FC<FieldProps<string>> = (props) => {
  const presets = ["full", "auto", "fixed"];
  const { schema, uiSchema, formData, onChange, required } = props;
  const [preset, setPreset] = useState(formData === "auto" ? "auto" : formData === "100%" ? "full" : "fixed");

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (preset === "auto") {
      onChange("auto");
    } else if (preset === "full") {
      onChange("100%");
    } else {
      onChange("100%");
    }
  }, [preset]);

  return (
    <div className="dimension-field">
      {fieldTitle && (
        <label className="control-label">
          {fieldTitle}
          {required ? <span className="required">*</span> : null}
        </label>
      )}
      {fieldDescription && <p className="field-description">{fieldDescription}</p>}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex divide-x divide-white dark:divide-dark-500">
          {presets.map((option) => (
            <button
              key={option}
              type="button"
              className={tx(`text-sm first:rounded-l last:rounded-r py-0.5 flex-1 capitalize`, {
                "bg-upstart-600 text-white": preset === option,
                "bg-gray-200 hover:bg-gray-300 dark:bg-dark-600 dark:hover:bg-dark-500 text-gray-800 dark:text-white/50":
                  preset !== option,
              })}
              onClick={() => setPreset(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {preset === "fixed" && (
          <div className="flex items-center gap-1">
            <input
              autoComplete="off"
              spellCheck="false"
              type="number"
              defaultValue={formData}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="form-input ring-upstart-600 focus:ring-transparent pr-2"
            />
            <select
              onChange={(e) => onChange(e.target.value)}
              defaultValue={formData}
              className="form-select grow-0 max-w-20"
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="em">em</option>
              <option value="rem">rem</option>
              <option value="dvh">dvh</option>
              <option value="dvw">dvw</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default DimensionField;
