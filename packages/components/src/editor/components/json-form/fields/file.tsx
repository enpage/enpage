import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, Text } from "@upstart.gg/style-system/system";
import { useEditor } from "~/editor/hooks/use-editor";
import { useMemo, useState } from "react";
import ModalSearchImage from "~/editor/components/ModalSearchImage";
import { tx } from "@twind/core";

const FileField: React.FC<FieldProps<string>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue } = props;
  const editor = useEditor();
  const [showSearch, setShowSearch] = useState(false);
  const id = useMemo(() => nanoid(), []);

  return (
    <>
      <div className="file-field flex items-center justify-between flex-wrap gap-1">
        {title && (
          <div className="flex-1">
            <label className={tx("file-title", { required })}>{title}</label>
            {description && <p className="field-description">{description}</p>}
          </div>
        )}
        <p>
          <input
            id={id}
            type="file"
            accept={schema["ui:accept"]}
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
            required={required}
          />
          <Button variant="soft" size="1" radius="full">
            <label
              className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]"
              htmlFor={id}
            >
              Upload
            </label>
          </Button>
        </p>
        {schema["ui:allow-url"] && (
          <p>
            <Button variant="soft" size="1" radius="full">
              <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                URL
              </label>
            </Button>
          </p>
        )}
        {schema["ui:show-img-search"] && (
          <p>
            <Button variant="soft" size="1" radius="full" onClick={() => setShowSearch(true)}>
              <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                Search
              </label>
            </Button>
          </p>
        )}
      </div>
      {formData && (
        <div className="border border-upstart-200 p-2 mt-3">
          <img src={currentValue} alt={id} className="max-w-full h-auto" />
        </div>
      )}
      {showSearch && (
        <ModalSearchImage
          onClose={() => {
            setShowSearch(false);
          }}
          onChoose={(url) => {
            onChange(url);
            setShowSearch(false);
          }}
        />
      )}
    </>
  );
};

export default FileField;
