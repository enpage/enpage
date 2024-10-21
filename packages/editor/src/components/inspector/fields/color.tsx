import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { Button, Popover } from "@enpage/style-system";
import { tx, colors } from "@enpage/sdk/browser/twind";

const shades = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"];

const ColorField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, id = nanoid(7), idSchema } = props;

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <div className="file-field flex items-center justify-between">
      {fieldTitle && (
        <div>
          <label className="file-title">
            {fieldTitle}
            {required ? <span className="required">*</span> : null}
          </label>
          {fieldDescription && <p className="field-description">{fieldDescription}</p>}
        </div>
      )}
      <ColorPreviewPill bgClassName="bg-red-500" />
    </div>
  );
};

function ColorPreviewPill({
  bgClassName,
  bgOpacityClassName,
}: { bgClassName: string; bgOpacityClassName?: string }) {
  console.log({ colors });
  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={tx(
            "rounded-full w-6 h-6 ring ring-transparent hover:ring-primary-400",
            bgClassName,
            bgOpacityClassName,
          )}
        />
      </Popover.Trigger>
      <Popover.Content width="308px" side="bottom" align="center">
        <div className="grid w-full p-0 gap-1">
          {colors
            .filter((color) => ["white", "black", "gray"].includes(color) === false)
            .map((color) => (
              <div key={color} className="flex gap-1">
                {shades.map((shade) => (
                  <button
                    key={shade}
                    type="button"
                    className={tx(
                      "rounded-full w-6 h-6 ring ring-transparent hover:ring-primary-400",
                      `bg-${color}-${shade}`,
                    )}
                  />
                ))}
              </div>
            ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

export default ColorField;
