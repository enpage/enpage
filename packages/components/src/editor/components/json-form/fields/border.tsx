import type { FieldProps } from "./types";
import { Text, Select } from "@upstart.gg/style-system/system";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { fieldLabel } from "../form-class";
import { ColorPill } from "./color";

export const BorderField: React.FC<FieldProps<BorderSettings>> = (props) => {
  const { currentValue, onChange, required, title, description, placeholder, schema } = props;

  return (
    <div className="border-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        {/* border width */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Width</label>
          <Select.Root defaultValue={currentValue.width} size="1">
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                <Select.Label>Width</Select.Label>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.width.anyOf.map((item: any) => (
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
          <label className={fieldLabel}>Style</label>
          <Select.Root defaultValue={currentValue.style} size="1">
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                <Select.Label>Style</Select.Label>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.style.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* break */}
        <div className="basis-full w-0" />
        {/* border rounding */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Rounding</label>
          <Select.Root defaultValue={currentValue.rounding} size="1">
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                <Select.Label>Rounding</Select.Label>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.rounding.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {/* border color */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Color</label>
          <ColorPill
            color={currentValue.color}
            elementColorType="border"
            onChange={(e) => onChange({ ...currentValue, color: e })}
          />
        </div>
      </div>
    </div>
  );
};
