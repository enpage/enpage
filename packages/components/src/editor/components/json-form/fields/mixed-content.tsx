import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import { Button, IconButton, Text } from "@upstart.gg/style-system/system";
import { useEditor } from "~/editor/hooks/use-editor";
import { useState } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { TextField } from "@upstart.gg/style-system/system";
import { VscSettings, VscDatabase } from "react-icons/vsc";
import { SegmentedControl } from "@upstart.gg/style-system/system";

const MixedContentField: React.FC<FieldProps<string>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue, placeholder } = props;

  const modes = { static: "Static", dynamic: "Dynamic" };
  const [currentMode, setCurrentMode] = useState("static");

  return (
    <div className="field field-string">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
          <SegmentedControl.Root
            onValueChange={setCurrentMode}
            defaultValue={currentMode}
            size="1"
            radius="full"
          >
            {Object.entries(modes).map(([key, value]) => (
              <SegmentedControl.Item
                key={key}
                value={key}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-2")}
              >
                {value}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      )}
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
      {currentMode === "static" ? (
        <TextField.Root
          defaultValue={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="!mt-1.5"
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <div>Select a datasource</div>
      )}
    </div>
  );
};

export default MixedContentField;
