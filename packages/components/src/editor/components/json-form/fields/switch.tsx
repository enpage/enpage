import { tx } from "@upstart.gg/style-system/twind";
import type { FieldProps } from "./types";
import { Switch, Text } from "@upstart.gg/style-system/system";

const SwitchField: React.FC<FieldProps<boolean>> = (props) => {
  const { onChange, required, title, description, currentValue } = props;

  return (
    <div className="switch-field flex items-center">
      {/* {title && (
        <div className="flex-1">
          <label className={tx("control-label", { required })}>{title}</label>
          {description && <p className="field-description">{description}</p>}
        </div>
      )} */}
      {title && (
        <Text as="label" size="2" weight="medium">
          {title}
        </Text>
      )}
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <Switch
        onCheckedChange={(value) => onChange(value)}
        size="1"
        variant="soft"
        defaultChecked={currentValue}
      />
    </div>
  );
};

export default SwitchField;
