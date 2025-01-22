import type { FieldProps } from "./types";
import { nanoid } from "nanoid";
import {
  Button,
  IconButton,
  Text,
  TextArea,
  Select,
  Popover,
  Box,
  Flex,
} from "@upstart.gg/style-system/system";
import { useEditor } from "~/editor/hooks/use-editor";
import { useState } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { TextField } from "@upstart.gg/style-system/system";
import { VscSettings, VscDatabase } from "react-icons/vsc";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { fieldLabel } from "../form-class";
import type { MixedContent } from "@upstart.gg/sdk/shared/bricks/props/common";
import { rssSchema } from "@upstart.gg/sdk/shared/datasources/schemas";
import { Type } from "@sinclair/typebox";
import { JSONSchemaView } from "../SchemaView";
import TextEditor from "~/shared/components/TextEditor";

const MixedContentField: React.FC<FieldProps<MixedContent>> = (props) => {
  const { schema, formData, onChange, required, title, description, currentValue, placeholder } = props;

  const editor = useEditor();
  const [currentText, setCurrentText] = useState(currentValue.text);

  return (
    <div className="field field-mixed-content">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
        </div>
      )}

      <div className={tx("relative")}>
        <TextEditor
          discrete={editor.textEditMode !== "large"}
          brickId="TEST"
          initialContent={currentText}
          menuPlacement="above-editor"
          enabled
          className={tx("text-sm form-textarea  focus:ring-0  h-full", {
            "flex-1 rounded rounded-t-none border-gray-300": editor.textEditMode === "large",
            "border-0": editor.textEditMode !== "large",
          })}
        />
      </div>
    </div>
  );
};

export default MixedContentField;
