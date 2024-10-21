import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { Button } from "@enpage/style-system";

const FileField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, id = nanoid(7), idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <div className="file-field flex items-center justify-between">
      {fieldTitle && (
        <div>
          <label className="file-title">
            {fieldTitle}
            {required ? <span className="required">*</span> : null}
          </label>
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
        </div>
      )}
      <input id={id} type="file" onChange={(e) => onChange(e.target.files)} required={required} />

      <Button variant="soft" size="1" radius="full">
        <label className="!leading-[inherit] !mb-0 !text-inherit cursor-[inherit]" htmlFor={id}>
          Choose file
        </label>
      </Button>
    </div>
  );
};

export default FileField;
