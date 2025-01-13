import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { TextField } from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";

const ObjectField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, id = nanoid(7), idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <div className="field field-object">
      OBJ
      {/* {fieldTitle && (
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
          <TbSlash className="bg-transparent h-5 w-5 rounded-md stroke-1 !-ml-1 !-mr-1" />
        </TextField.Slot>
      </TextField.Root> */}
    </div>
  );
};

export default ObjectField;
