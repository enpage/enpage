import type { FieldProps } from "@rjsf/utils";
import { Button, Popover, Text } from "@upstart.gg/style-system";
import { tx, colors, css } from "@upstart.gg/style-system/twind";
import transSvg from "./trans.svg?url";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  isStandardColor,
  type ColorType,
  type ElementColor,
  type ElementColorType,
} from "@upstart.gg/sdk/shared/themes/color-system";
import BaseColorPicker, { ElementColorPicker } from "~/editor/components/ColorPicker";

const ColorField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, idSchema, formContext } = props;
  // if (name === "borderColor" && brick?.props.borderWidth === "border-0") {
  //   return null;
  // }

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];
  const elementColorType = (uiSchema?.["ui:color-type"] ??
    "page-background") as ColorElementPreviewPillProps["elementColorType"];

  return (
    <ColorFieldRow
      name={fieldTitle}
      description={fieldDescription}
      color={formData}
      required={required}
      onChange={onChange}
      elementColorType={elementColorType}
    />
  );
};

type ColorFieldRowProps = {
  name: string;
  labelClassName?: string;
  description?: string;
  required?: boolean;
} & (
  | {
      color: string;
      colorType?: ColorBasePreviewPillProps["colorType"];
      onChange: ColorBasePreviewPillProps["onChange"];
      elementColorType?: never;
    }
  | {
      color: ElementColor;
      colorType?: never;
      elementColorType?: ColorElementPreviewPillProps["elementColorType"];
      onChange: ColorElementPreviewPillProps["onChange"];
    }
);

export function ColorFieldRow({
  name,
  description,
  color,
  required,
  labelClassName,
  onChange,
  colorType,
  elementColorType,
}: ColorFieldRowProps) {
  return (
    <div className="color-field flex items-center justify-between">
      {name && (
        <div className="flex-1">
          <label className={tx("control-label", labelClassName)}>
            {name}
            {required ? <span className="required">*</span> : null}
          </label>
          {description && (
            <Text as="p" color="gray" className={tx("field-description")}>
              {description}
            </Text>
          )}
        </div>
      )}
      {colorType && <ColorBasePreviewPill onChange={onChange} colorType={colorType} color={color} />}
      {elementColorType && (
        <ColorElementPreviewPill onChange={onChange} elementColorType={elementColorType} color={color} />
      )}
    </div>
  );
}

type ColorElementPreviewPillProps = {
  color: ElementColor;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  elementColorType: ElementColorType;
  onChange: (newVal: ElementColor) => void;
};

function ColorElementPreviewPill({
  color,
  onChange,
  elementColorType,
  side = "bottom",
  align = "center",
}: ColorElementPreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          data-color={color}
          data-element-color-type={elementColorType}
          className={tx(
            "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
            css({
              backgroundImage: pillBgFile,
              backgroundColor: color === "transparent" ? "transparent" : color,
              backgroundSize,
            }),
          )}
        />
      </Popover.Trigger>
      <ColorElementPopover
        elementColorType={elementColorType}
        side={side}
        align={align}
        color={color}
        onChange={onChange}
      />
    </Popover.Root>
  );
}

type ColorBasePreviewPillProps = {
  color: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  colorType: ColorType;
  onChange: (newVal: string) => void;
};

function ColorBasePreviewPill({
  color,
  onChange,
  colorType,
  side = "bottom",
  align = "center",
}: ColorBasePreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";
  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={tx(
            "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
            css({
              backgroundImage: pillBgFile,
              backgroundColor: color === "transparent" ? "transparent" : color,
              backgroundSize,
            }),
          )}
        />
      </Popover.Trigger>
      <ColorBasePopover colorType={colorType} side={side} align={align} color={color} onChange={onChange} />
    </Popover.Root>
  );
}

function ColorBasePopover({
  colorType,
  side,
  align,
  color,
  onChange,
}: Pick<ColorBasePreviewPillProps, "align" | "side" | "color" | "colorType" | "onChange">) {
  const width = "300px";
  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <BaseColorPicker colorType={colorType} initialValue={color} onChange={onChange} />
    </Popover.Content>
  );
}

function ColorElementPopover({
  elementColorType,
  side,
  align,
  color,
  onChange,
}: Pick<ColorElementPreviewPillProps, "align" | "side" | "color" | "elementColorType" | "onChange">) {
  let width = "398px";
  switch (elementColorType) {
    case "page-background":
    case "background":
      width = "200px";
      break;
    case "page-text":
      width = "180px";
      break;
    case "border":
      width = "186px";
      break;
  }
  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <ElementColorPicker elementColorType={elementColorType} initialValue={color} onChange={onChange} />
    </Popover.Content>
  );
}

function elementColorToClassName(color: ElementColor, prefix = "bg") {
  if (isStandardColor(color)) {
    return `${prefix}-[${color}]`;
  }
  return color;
}

export default ColorField;
