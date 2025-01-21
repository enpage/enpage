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

  const modes = { static: "Static", dynamic: "Dynamic" };
  const editor = useEditor();

  const [currentMode, setCurrentMode] = useState(currentValue.mode);
  const [currentText, setCurrentText] = useState(currentValue.mode === "static" ? currentValue.text : "");
  const [currentDatasourceId, setCurrentDatasourceId] = useState(
    currentValue.mode === "dynamic" ? currentValue.datasourceId : null,
  );

  const availableDatasources = [
    { id: "1", label: "Datasource 1" },
    { id: "2", label: "Datasource 2" },
    { id: "3", label: "Datasource 3" },
  ];

  console.log("mixed content", { formData });

  return (
    <div className="field field-mixed-content">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
          <SegmentedControl.Root
            /* @ts-ignore */
            onValueChange={setCurrentMode}
            defaultValue={currentMode}
            size="1"
            radius="full"
          >
            {Object.entries(modes).map(([key, value]) => (
              <SegmentedControl.Item
                key={key}
                value={key}
                // className={tx("[&_.rt-SegmentedControlItemLabel]:px-2")}
              >
                {value}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      )}

      {currentMode === "static" ? (
        currentValue.multiline ? (
          <TextField.Root
            defaultValue={currentText}
            /** @ts-ignore */
            onChange={(e) => onChange({ ...currentValue, text: e.target.value })}
            className="!mt-2"
            required={required}
            placeholder={placeholder}
          />
        ) : (
          <div className={tx("relative")}>
            {/* <TextArea
              defaultValue={currentText}
              onChange={(e) => onChange({ ...currentValue, text: e.target.value })}
              className="!mt-2"
              required={required}
              placeholder={placeholder}
              rows={10}
              resize="vertical"
            /> */}
            <TextEditor
              brickId="TEST"
              initialContent={currentText}
              menuPlacement="above-editor"
              enabled
              className={tx(
                "text-sm form-textarea rounded border-gray-300 focus:ring-upstart-500 focus:border-upstart-500 rounded-t-none h-full",
                {
                  "flex-1": editor.textEditMode === "large",
                },
              )}
            />
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className={fieldLabel}>Data source</label>
            <Select.Root
              defaultValue={currentDatasourceId ?? undefined}
              size="1"
              onValueChange={setCurrentDatasourceId}
            >
              <Select.Trigger radius="large" variant="ghost" placeholder="Select a Data source" />
              <Select.Content position="popper">
                <Select.Group>
                  <Select.Label>Datasource</Select.Label>
                  {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                  {availableDatasources.map((item: any) => (
                    <Select.Item key={item.id} value={item.id}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          {currentDatasourceId && (
            <div className="flex items-center justify-between flex-1">
              <label className={fieldLabel}>Field</label>
              <Popover.Root>
                <Popover.Trigger>
                  <Button variant="soft" size="1" radius="full">
                    Pick a field
                  </Button>
                </Popover.Trigger>
                <Popover.Content width="460px" side="right" align="center">
                  <DatasourceFieldPicker />
                </Popover.Content>
              </Popover.Root>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function DatasourceFieldPicker() {
  const fakeSchema = rssSchema;
  return (
    <JSONSchemaView
      schema={fakeSchema}
      onChange={() => {
        console.log("changed");
      }}
    />
  );
}

export default MixedContentField;
