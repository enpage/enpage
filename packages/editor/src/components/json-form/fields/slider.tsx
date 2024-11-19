import type { FieldProps } from "@rjsf/utils";
import { Slider } from "@enpage/style-system";

const SliderField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  console.log("SliderField", { schema, uiSchema });

  return (
    <div className="slider-field">
      {fieldTitle && (
        <div>
          <label className="control-label">
            {fieldTitle}
            {required ? <span className="required">*</span> : null}
          </label>
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
        </div>
      )}
      <Slider
        className="!mt-3"
        onValueChange={(value) => onChange(value[0])}
        size="1"
        variant="soft"
        min={schema.minimum}
        max={schema.maximum}
        step={schema.multipleOf ?? 1}
        defaultValue={[formData]}
      />
    </div>
  );
};

export default SliderField;
