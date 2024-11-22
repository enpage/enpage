import type { FieldProps } from "@rjsf/utils";
import { Switch } from "@upstart.gg/style-system";

const SwitchField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <div className="switch-field flex items-center">
      {fieldTitle && (
        <div className="flex-1">
          <label className="control-label">
            {fieldTitle}
            {required ? <span className="required">*</span> : null}
          </label>
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
        </div>
      )}
      <Switch
        onCheckedChange={(value) => onChange(value)}
        size="1"
        variant="soft"
        defaultChecked={formData}
      />
    </div>
  );
};

export default SwitchField;
