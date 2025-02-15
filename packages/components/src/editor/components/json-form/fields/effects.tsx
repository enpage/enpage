import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { EffectsSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { fieldLabel } from "../form-class";
import { useState } from "react";

export const EffectsField: React.FC<FieldProps<EffectsSettings>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  const [opacity, setOpacity] = useState(currentValue.opacity);

  const onOpacityChange = (value: number) => {
    setOpacity(value);
    onChange({ ...currentValue, opacity: value });
  };

  return (
    <div className="border-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        {/* shadow */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Shadow</label>
          <Select.Root
            defaultValue={currentValue.shadow}
            size="2"
            onValueChange={(value) =>
              onChange({ ...currentValue, shadow: value as EffectsSettings["shadow"] })
            }
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.shadow.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* border style */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>
            Opacity{" "}
            <span className="text-gray-500 dark:text-gray-50 font-normal text-xs">
              ({(opacity ?? 1) * 100}%)
            </span>
          </label>
          <Slider
            className="!mt-1 !mx-px"
            onValueChange={(value) => onOpacityChange(value[0])}
            size="1"
            variant="soft"
            min={0.1}
            max={1}
            step={0.1}
            defaultValue={[currentValue.opacity ?? 1]}
          />
        </div>
      </div>
    </div>
  );
};
