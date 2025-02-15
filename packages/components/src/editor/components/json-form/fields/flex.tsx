import type { FieldProps } from "./types";
import { Text, Select, Slider } from "@upstart.gg/style-system/system";
import type { DimensionsSettings, FlexSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import { fieldLabel } from "../form-class";
import { SegmentedControl, Switch } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { HelpIcon } from "../HelpIcon";

export const FlexField: React.FC<FieldProps<FlexSettings>> = (props) => {
  const {
    currentValue = {
      direction: "row",
      wrap: "nowrap",
      justify: "start",
      align: "stretch",
      gap: "1",
    } satisfies FlexSettings,
    onChange,
    description,
    schema,
  } = props;

  const onSettingsChange = (newVal: Partial<FlexSettings>) => onChange({ ...currentValue, ...newVal });

  return (
    <div className="border-field">
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      <div className="flex items-start flex-wrap gap-x-4 gap-y-1">
        {/* Direction */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Direction</label>
          <SegmentedControl.Root
            onValueChange={(value) => onSettingsChange({ direction: value as FlexSettings["direction"] })}
            defaultValue={currentValue.direction as string}
            size="1"
            className="w-full mt-0.5 !max-w-full"
            radius="full"
          >
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {schema.properties.direction.anyOf.map((option: any) => (
              <SegmentedControl.Item
                key={option.const}
                value={option.const}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.title}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>

        {/* Gap */}
        <div className="flex flex-col gap-1 flex-1">
          <label className={fieldLabel}>Gap</label>
          <Select.Root
            defaultValue={currentValue.gap}
            size="2"
            onValueChange={(value) => onSettingsChange({ gap: value as FlexSettings["gap"] })}
          >
            <Select.Trigger radius="large" variant="ghost" className="!mt-[1px]" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.gap.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {/* break */}
        <div className="basis-full w-0 h-2" />

        {/* Justify */}
        <div className="flex flex-col gap-1 basis-1/3">
          <label className={fieldLabel}>Justify</label>
          <Select.Root
            defaultValue={currentValue.justify}
            size="2"
            onValueChange={(value) => onSettingsChange({ justify: value as FlexSettings["justify"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.justify.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Align */}
        <div className="flex flex-col gap-1 basis-1/3">
          <div className="flex justify-between items-center">
            <label className={fieldLabel}>Align</label>
            <HelpIcon help="Choose how the children should be aligned within the container, on the cross axis." />
          </div>

          <Select.Root
            defaultValue={currentValue.align}
            size="2"
            onValueChange={(value) => onSettingsChange({ align: value as FlexSettings["align"] })}
          >
            <Select.Trigger radius="large" variant="ghost" />
            <Select.Content position="popper">
              <Select.Group>
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {schema.properties.align.anyOf.map((item: any) => (
                  <Select.Item key={item.const} value={item.const}>
                    {item.title}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Wrap */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex justify-between items-center">
            <label className={fieldLabel}>Wrap</label>
            <HelpIcon help="Whether the children bricks should wrap to the next line when they reach the end of the container." />
          </div>
          <Switch
            onCheckedChange={(value) =>
              onSettingsChange({ wrap: value ? "wrap" : ("nowrap" as FlexSettings["wrap"]) })
            }
            size="2"
            variant="soft"
            defaultChecked={currentValue.wrap === "wrap"}
          />
        </div>
      </div>
    </div>
  );
};
