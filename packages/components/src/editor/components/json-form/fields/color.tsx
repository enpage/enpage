import { IconButton, Popover, Text } from "@upstart.gg/style-system/system";
import { tx, css } from "@upstart.gg/style-system/twind";
import transSvg from "./trans.svg?url";
import type { ColorType, ElementColor, ElementColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import BaseColorPicker, { ElementColorPicker } from "~/editor/components/ColorPicker";
import type { FieldProps } from "./types";
import { IoCloseOutline } from "react-icons/io5";

const ColorField: React.FC<FieldProps<string | undefined>> = (props) => {
  const { schema, onChange, formSchema: formContext, currentValue, title, description } = props;
  const elementColorType = (schema["ui:color-type"] ??
    "page-background") as ColorElementPreviewPillProps["elementColorType"];

  if (schema["ui:display"] === "inline") {
    return <div>inline color pill</div>;
  }

  return (
    <ColorFieldRow
      name={title}
      description={description}
      color={currentValue}
      required={schema.required}
      onChange={onChange}
      elementColorType={elementColorType}
    />
  );
};

type ColorFieldRowProps = {
  name?: string;
  labelClassName?: string;
  description?: string;
  required?: boolean;
  showReset?: boolean;
} & (
  | {
      color?: string;
      colorType?: ColorBasePreviewPillProps["colorType"];
      onChange: ColorBasePreviewPillProps["onChange"];
      elementColorType?: never;
    }
  | {
      color?: ElementColor;
      colorType?: never;
      elementColorType?: ColorElementPreviewPillProps["elementColorType"];
      onChange: ColorElementPreviewPillProps["onChange"];
    }
);

export function ColorPill({ colorType, elementColorType, color, onChange }: ColorFieldRowProps) {
  return (
    <>
      {colorType && <ColorBasePreviewPill onChange={onChange} colorType={colorType} color={color} />}
      {elementColorType && (
        <ColorElementPreviewPill onChange={onChange} elementColorType={elementColorType} color={color} />
      )}
    </>
  );
}

export function ColorFieldRow({
  name,
  description,
  color,
  required,
  labelClassName,
  onChange,
  colorType,
  showReset,
  elementColorType,
}: ColorFieldRowProps) {
  return (
    <div className="color-field flex items-center justify-between">
      {name && (
        <div className="flex-1">
          <Text as="label" size="2" weight="medium">
            {name}
          </Text>
          {description && (
            <Text as="p" color="gray">
              {description}
            </Text>
          )}
        </div>
      )}
      {colorType && (
        <ColorBasePreviewPill onChange={onChange} colorType={colorType} color={color} showReset={showReset} />
      )}
      {elementColorType && (
        <ColorElementPreviewPill
          onChange={onChange}
          elementColorType={elementColorType}
          color={color}
          showReset={showReset}
        />
      )}
    </div>
  );
}

type ColorElementPreviewPillProps = {
  color?: ElementColor;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  elementColorType: ElementColorType;
  showReset?: boolean;
  onChange: (newVal: ElementColor) => void;
};

function ColorElementPreviewPill({
  color,
  onChange,
  elementColorType,
  side = "bottom",
  align = "center",
  showReset,
}: ColorElementPreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2">
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
          {showReset && (
            <IconButton
              title="Reset"
              size="1"
              variant="ghost"
              color="gray"
              onClick={() => onChange("transparent")}
            >
              <IoCloseOutline />
            </IconButton>
          )}
        </div>
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
  color?: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  colorType: ColorType;
  showReset?: boolean;
  onChange: (newVal: string) => void;
};

function ColorBasePreviewPill({
  color,
  onChange,
  colorType,
  side = "bottom",
  align = "center",
  showReset,
}: ColorBasePreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2">
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
          {showReset && (
            <IconButton
              title="Reset"
              size="1"
              variant="ghost"
              color="gray"
              onClick={() => onChange("transparent")}
            >
              <IoCloseOutline />
            </IconButton>
          )}
        </div>
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
    case "text":
      width = "216px";
      break;
  }
  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <ElementColorPicker elementColorType={elementColorType} initialValue={color} onChange={onChange} />
    </Popover.Content>
  );
}

// function elementColorToClassName(color: ElementColor, prefix = "bg") {
//   if (isStandardColor(color)) {
//     return `${prefix}-[${color}]`;
//   }
//   return color;
// }

export default ColorField;
