import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { TextField } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";

const PathField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, id = nanoid(7), idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  // remove leading slash
  const path = (formData || "").toString().replace(/^\//, "");

  return (
    <div className="field field-string">
      {fieldTitle && (
        <div>
          <label className="control-label">
            {fieldTitle}
            {required ? <span className="required">*</span> : null}
          </label>
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
        </div>
      )}
      <TextField.Root defaultValue={path} className="!mt-1.5">
        <TextField.Slot>
          <TbSlash className="bg-gray-100 h-6 w-6 rounded-md stroke-1 !-ml-1" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

export default PathField;
