import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, Text } from "@upstart.gg/style-system/system";
import { useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/style-props";
import ColorField from "./color";
import { useUploader } from "../../UploaderContext";

const BackgroundField: React.FC<FieldProps<BackgroundSettings>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue } = props;
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);
  const { onImageUpload } = useUploader();
  const onPropsChange = (newVal: Partial<BackgroundSettings>) => onChange({ ...currentValue, ...newVal });

  console.log("background schema", schema);

  return (
    <>
      <div className="file-field flex items-center justify-between flex-wrap gap-1">
        {title && (
          <div className="flex items-center justify-between">
            <Text as="label" size="2" weight="medium">
              {title}
            </Text>
          </div>
        )}
        <div className="flex gap-1.5">
          <ColorField
            {...props}
            currentValue={currentValue.color}
            title={undefined}
            onChange={(color) => {
              onChange({ ...currentValue, color: color as string });
            }}
          />
          <input
            id={id}
            type="file"
            className="overflow-hidden w-[0.1px] h-[0.1px] opacity-0 absolute -z-10"
            accept={
              schema["ui:accept"] ?? "image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/gif"
            }
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onImageUpload(file);
              const src = file.name;
              console.log("file", file);
              if (src) {
                onChange({ ...currentValue, image: src as string });
              }
            }}
            required={required}
          />
          <Button variant="soft" size="1" radius="full" type="button">
            <label
              className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]"
              htmlFor={id}
            >
              {currentValue.image ? "Upload new" : "Upload image"}
            </label>
          </Button>

          {schema["ui:show-img-search"] && (
            <Button variant="soft" size="1" radius="full" type="button" onClick={() => setShowSearch(true)}>
              <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                Search
              </label>
            </Button>
          )}
        </div>
      </div>
      {currentValue.image && (
        <div className="border border-upstart-200 p-1.5 self-end">
          <img src={currentValue.image} alt={id} className="max-w-full h-auto" />
        </div>
      )}
      <ModalSearchImage
        open={showSearch}
        onClose={() => {
          setShowSearch(false);
        }}
        onChoose={(url) => {
          onPropsChange({ image: url });
          setShowSearch(false);
        }}
      />
    </>
  );
};

export default BackgroundField;
