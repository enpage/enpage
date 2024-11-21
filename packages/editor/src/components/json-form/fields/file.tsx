import type { FieldProps } from "@rjsf/utils";
import { nanoid } from "nanoid";
import { Button, Text } from "@enpage/style-system";
import { useEditor } from "~/hooks/use-editor";
import { useState } from "react";
import ModalSearchImage from "~/components/ModalSearchImage";

const FileField: React.FC<FieldProps> = (props) => {
  const { schema, uiSchema, formData, onChange, required, name, id = nanoid(7), idSchema } = props;
  const editor = useEditor();
  const [showSearch, setShowSearch] = useState(false);

  // Extract field-level properties
  const fieldTitle = schema.title || uiSchema?.["ui:title"];
  const fieldDescription = schema.description || uiSchema?.["ui:description"];

  return (
    <>
      <div className="file-field flex items-center justify-between flex-wrap gap-1">
        {fieldTitle && (
          <div className="flex-1">
            <label className="file-title">
              {fieldTitle}
              {required ? <span className="required">*</span> : null}
            </label>
            {fieldDescription && <p className="field-description">{fieldDescription}</p>}
          </div>
        )}
        <p>
          <input
            id={id}
            type="file"
            accept={uiSchema?.["ui:accept"]}
            onChange={(e) => onChange(e.target.files)}
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
        {uiSchema?.["ui:allow-url"] && (
          <p>
            <Button variant="soft" size="1" radius="full">
              <label className="!leading-[inherit] !mb-0 !font-medium !text-inherit cursor-[inherit]">
                URL
              </label>
            </Button>
          </p>
        )}
        {uiSchema?.["ui:show-img-search"] && (
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
          <img src={formData} alt={name} className="max-w-full h-auto" />
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
