import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { Button, Popover, TextField } from "@enpage/style-system";
import { tx, colors } from "@enpage/sdk/browser/twind";
import { generateColorHarmony } from "../../color-helpers";

const shades = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

const ColorField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <ColorFieldRow
      name={fieldTitle}
      description={fieldDescription}
      color={formData}
      required={required}
      pillClassName="bg-red-500"
      colorType="all"
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
}: {
  name: string;
  color: string;
  pillClassName: string;
  labelClassName?: string;
  descClassName?: string;
  description?: string;
  required?: boolean;
  onChange?: (newVal: string) => void;
  colorType: ColorPreviewPillProps["colorType"];
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
      <ColorPreviewPill bgClassName={pillClassName} colorType={colorType} color={color} />
    </div>
  );
}

type ColorPreviewPillProps = {
  color: string;
  bgClassName: string;
  bgOpacityClassName?: string;
  colorType?: "all" | "theme-colors" | "theme-colors-with-shades" | "neutral" | "theme-base";
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
};

function ColorPreviewPill({
  color,
  bgClassName,
  bgOpacityClassName,
  colorType = "all",
  side = "bottom",
  align = "center",
}: ColorPreviewPillProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={tx(
            "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400",
            bgClassName,
            bgOpacityClassName,
          )}
        />
      </Popover.Trigger>
      <ColorPopover colorType={colorType} side={side} align={align} color={color} />
    </Popover.Root>
  );
}

function ColorPopover({
  colorType,
  side,
  align,
  color,
}: Pick<ColorPreviewPillProps, "colorType" | "align" | "side" | "color">) {
  let width = "308px";
  let filteredColors = colors;
  let filteredShades = shades;
  let direction: "flex-row" | "flex-col" = "flex-row";

  switch (colorType) {
    case "theme-colors":
      width = "120px";
      break;
    case "theme-colors-with-shades":
      width = "200px";
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
        <form className="group text-xs">
          <div className="mt-2 flex justify-between items-center gap-x-1 border-t border-upstart-100 pt-2">
            <div className="flex flex-1">
              <span>Suggestions:</span>
              <span>{generateColorHarmony(color).join(",")}</span>
            </div>
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
