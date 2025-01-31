import type { FieldProps } from "./types";
import { TextField } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { TbSlash } from "react-icons/tb";
import { fieldLabel } from "../form-class";
import { Text, Select } from "@upstart.gg/style-system/system";

export const StringField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder } = props;

  console.log("in StringField", { currentValue });

  return (
    <div className="field field-string">
      {title && (
        <div>
          <label className={fieldLabel}>{title}</label>
          {description && (
            <Text as="p" color="gray" size="1">
              {description}
            </Text>
          )}
        </div>
      )}
      <TextField.Root
        defaultValue={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="!mt-1.5"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export const PathField: React.FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder } = props;

  // remove leading slash
  const path = (currentValue || "").toString().replace(/^\//, "");

  return (
    <div className="field field-string">
      {title && (
        <div>
          <label className={fieldLabel}>{title}</label>
          {description && (
            <Text as="p" color="gray" size="1">
              {description}
            </Text>
          )}
        </div>
      )}
      <TextField.Root
        defaultValue={path}
        onChange={(e) => onChange(e.target.value)}
        className="!mt-1.5"
        required={required}
        placeholder={placeholder}
      >
        <TextField.Slot>
          <TbSlash className="bg-transparent h-5 w-5 rounded-md stroke-1 !-ml-1 !-mr-1" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};
