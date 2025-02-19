import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { LayoutSettings, AlignSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { fieldLabel } from "../form-class";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import {
  PiAlignCenterVertical,
  PiAlignBottom,
  PiAlignTop,
  PiAlignLeft,
  PiAlignRight,
  PiAlignCenterHorizontal,
} from "react-icons/pi";
import { LuAlignHorizontalSpaceBetween } from "react-icons/lu";

export const AlignField: React.FC<FieldProps<AlignSettings>> = (props) => {
  const {
    currentValue = {
      horizontal: "start",
      vertical: "start",
    },
    onChange,
    required,
    title,
    description,
    placeholder,
    schema,
  } = props;
  const onSettingsChange = (newVal: Partial<AlignSettings>) => {
    const newProps = { ...currentValue, ...newVal };
    onChange(newProps);
  };

  return (
    <div className="layout-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Horizontal</label>
          <Select.Root
            defaultValue={currentValue.horizontal}
            size="2"
            onValueChange={(value) => onSettingsChange({ horizontal: value as AlignSettings["horizontal"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.horizontal.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Vertical</label>
          <Select.Root
            defaultValue={currentValue.vertical}
            size="2"
            onValueChange={(value) => onSettingsChange({ vertical: value as AlignSettings["vertical"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.vertical.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
};
