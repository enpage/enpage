import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { Button, Popover, TextField } from "@enpage/style-system";
import { tx, colors, css } from "@enpage/sdk/browser/twind";
import { generateColorHarmony } from "../../color-helpers";
import { useDraft } from "@enpage/sdk/browser/use-editor";
import type { Theme } from "@enpage/sdk/shared/theme";
import transSvg from "./trans.svg?url";
import { useMemo } from "react";

const shades = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

const ColorField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];
  const pillClassName = `bg-${formData}`;

  console.log("colorfield", { uiSchema });

  return (
    <ColorFieldRow
      name={fieldTitle}
      description={fieldDescription}
      color={formData}
      required={required}
      onChange={onChange}
      pillClassName={pillClassName}
      colorType="theme-bg-colors-with-shades"
      colorName="generic"
    />
  );
};

export function ColorFieldRow({
  name,
  description,
  color,
  required,
  pillClassName,
  labelClassName,
  descClassName,
  onChange,
  colorType,
  colorName,
}: {
  name: string;
  color: string;
  pillClassName: string;
  labelClassName?: string;
  descClassName?: string;
  description?: string;
  required?: boolean;
  onChange: ColorPreviewPillProps["onChange"];
  colorType: ColorPreviewPillProps["colorType"];
  colorName: ColorPreviewPillProps["colorName"];
}) {
  return (
    <div className="color-field flex items-center justify-between">
      {name && (
        <div className="flex-1">
          <label className={tx("control-label", labelClassName)}>
            {name}
            {required ? <span className="required">*</span> : null}
          </label>
          {description && <p className={tx("field-description", descClassName)}>{description}</p>}
        </div>
      )}
      <ColorPreviewPill
        onChange={onChange}
        bgClassName={pillClassName}
        colorType={colorType}
        color={color}
        colorName={colorName}
      />
    </div>
  );
}

type ColorPreviewPillProps = {
  color: string;
  bgClassName: string;
  bgOpacityClassName?: string;
  colorType?: "all" | "theme-colors" | "theme-bg-colors-with-shades" | "neutral" | "theme-base";
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  colorName: keyof Theme["colors"] | "generic";
  onChange: (newVal: string) => void;
};

function ColorPreviewPill({
  color,
  bgClassName,
  bgOpacityClassName,
  colorName,
  onChange,
  colorType = "all",
  side = "bottom",
  align = "center",
}: ColorPreviewPillProps) {
  const pillBgColor = color.startsWith("#") ? `bg-[${color}]` : `bg-${color}`;
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={tx(
            "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
            // bgClassName,
            pillBgColor,
            bgOpacityClassName,
            css({
              backgroundImage: pillBgFile,
              backgroundSize,
            }),
          )}
        />
      </Popover.Trigger>
      <ColorPopover
        colorType={colorType}
        side={side}
        align={align}
        color={color}
        colorName={colorName}
        onChange={onChange}
      />
    </Popover.Root>
  );
}

function ColorPopover({
  colorType,
  colorName,
  side,
  align,
  color,
  onChange,
}: Pick<ColorPreviewPillProps, "colorType" | "align" | "side" | "color" | "colorName" | "onChange">) {
  const { theme } = useDraft();
  let width = "308px";
  let filteredColors = colors;
  let filteredShades = shades;
  let direction: "flex-row" | "flex-col" = "flex-row";

  const showSuggestions = useMemo(() => colorName !== "generic" && colorName !== "primary", [colorName]);
  const suggestions = useMemo(
    () => (showSuggestions ? generateColorHarmony(theme.colors, colorName) : []),
    [theme.colors, showSuggestions, colorName],
  );

  switch (colorType) {
    case "theme-colors":
      width = "120px";
      break;
    case "theme-bg-colors-with-shades":
      width = "106px";
      direction = "flex-col";
      filteredColors = ["primary", "secondary", "tertiary"];
      filteredShades = ["0", "1", "2"];
      side = "right";
      align = "start";
      break;
    case "neutral":
      width = "90px";
      filteredColors = ["gray", "zinc"];
      direction = "flex-col";
      filteredShades = ["600", "500", "400", "300"];
      side = "right";
      align = "start";
      break;
    case "theme-base":
      width = "590px";
      filteredShades = ["600", "500", "400", "300"];
      direction = "flex-col";
      side = "right";
      align = "start";
      break;
    default:
      filteredColors = filteredColors.filter((color) => ["white", "black", "gray"].includes(color) === false);
      width = "308px";
  }

  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <div className="w-full flex gap-1 justify-center items-center mx-auto">
        {filteredColors.map((color) => (
          <div key={color} className={tx("flex gap-1 justify-center items-center", direction)}>
            {filteredShades.map((shade) => (
              <button
                key={shade}
                type="button"
                onClick={() => onChange(`${color}-${shade}`)}
                className={tx(
                  "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400",
                  `bg-${color}-${shade}`,
                )}
              />
            ))}
          </div>
        ))}
      </div>
      {colorType === "theme-base" && (
        <form className="group ">
          <div
            className={tx("mt-2 flex text-xs items-center gap-x-1 border-t border-upstart-100 pt-2", {
              "justify-between": showSuggestions,
              "justify-end": !showSuggestions,
            })}
          >
            {showSuggestions && (
              <div className="flex flex-1 items-center gap-x-2">
                <span>Suggestions:</span>
                <div className="flex gap-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className={tx(
                        "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400",
                        `bg-[${suggestion}]`,
                      )}
                      onClick={() => onChange(suggestion)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-1 items-center justify-end">
              <span>Use a custom color:</span>
              <TextField.Root
                required
                placeholder="#123456"
                size="1"
                className="w-20"
                pattern="#[0-9a-fA-F]{6}"
                maxLength={7}
              />
              <Button
                size="1"
                variant="soft"
                className="mr-2 group-invalid:pointer-events-none group-invalid:opacity-60"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      )}
    </Popover.Content>
  );
}

export default ColorField;
