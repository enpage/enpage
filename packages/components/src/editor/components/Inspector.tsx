import { useState } from "react";
import { useDraft, useEditor } from "../hooks/use-editor";
import { BsArrowBarLeft } from "react-icons/bs";
import Form, { type IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { customFields } from "./json-form/fields";
import { TbHelp } from "react-icons/tb";
import { useLocalStorage } from "usehooks-ts";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import { jsonFormClass } from "./json-form/form-class";
import { Tabs } from "@upstart.gg/style-system/system";
import { manifests, defaults } from "~/shared/bricks/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { CustomObjectFieldTemplate } from "./CustomObjectFieldTemplate";
import "./json-form/json-form.css";

export default function Inspector() {
  const editor = useEditor();
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", true, {
    initializeWithValue: true,
  });

  if (!editor.selectedBrick) {
    return null;
  }

  const manifest = manifests[editor.selectedBrick.type];
  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(editor.selectedBrick)}`);
    editor.deselectBrick();
    return null;
  }

  const tabsCount = [
    1,
    manifest.properties.datasource,
    manifest.properties.datarecord,
    editor.selectedBrick.type === "text",
  ].filter(Boolean).length;

  return (
    <Tabs.Root defaultValue="style">
      {tabsCount > 1 && (
        <Tabs.List className="sticky top-0 z-50">
          <Tabs.Trigger value="style" className="!flex-1">
            Style
          </Tabs.Trigger>
          {manifest.properties.datasource && (
            <Tabs.Trigger value="datasource" className="!flex-1">
              Data source
            </Tabs.Trigger>
          )}
          {manifest.properties.datarecord && (
            <Tabs.Trigger value="datarecord" className="!flex-1">
              Data record
            </Tabs.Trigger>
          )}
          {editor.selectedBrick.type === "text" && (
            <Tabs.Trigger value="ai" className="!flex-1">
              Upstart AI
            </Tabs.Trigger>
          )}
        </Tabs.List>
      )}
      <ScrollablePanelTab tab="style">
        <div className="flex justify-between pr-0">
          <h2 className="py-1.5 px-2 flex justify-between bg-gray-100 dark:bg-dark-600 items-center font-medium text-sm capitalize flex-1 select-none">
            {manifest.properties.title.const}
            <TbHelp
              className="w-5 h-5 dark:text-white opacity-50 dark:hover:opacity-80 cursor-pointer"
              onClick={() => setShowHelp(!showHelp)}
            />
          </h2>
          <button
            type="button"
            className="justify-self-end self-stretch p-2 hover:text-white aspect-square text-white/90 md:hidden"
            onClick={() => editor.setSelectedBrick()}
          >
            <BsArrowBarLeft className="w-auto" size={22} />
          </button>
        </div>
        <ElementInspector brick={editor.selectedBrick} showHelp={showHelp} />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function ElementInspector({ brick, showHelp }: { brick: Brick; showHelp: boolean }) {
  const draft = useDraft();
  const brickDefaults = defaults[brick.type];
  const [state, setState] = useState({ ...brickDefaults.props, ...brick.props });

  console.log("element state", state);

  const onChange = (data: IChangeEvent, id?: string) => {
    if (!id) {
      // ignore changes that don't have an id
      return;
    }
    setState(data.formData);
    console.log("changed", data.formData, id);
    draft.updateBrickProps(brick.id, data.formData);
  };

  const manifest = manifests[brick.type];

  if (manifest) {
    const uiSchema = createUiSchema(manifest.properties.props);
    return (
      <Form
        key={`inspector-${brick.id}`}
        autoComplete="off"
        className={tx("json-form", jsonFormClass, showHelp && "hide-help")}
        formData={state}
        schema={manifest.properties.props}
        formContext={{ brickId: brick.id }}
        validator={validator}
        uiSchema={uiSchema}
        onChange={onChange}
        fields={customFields}
        templates={{ ObjectFieldTemplate: CustomObjectFieldTemplate }}
        onSubmit={(e) => console.log("onSubmit", e)}
        onError={(e) => console.log("onError", e)}
      />
    );
  }
  return <pre className="text-xs">{JSON.stringify(brick, null, 2)}</pre>;
}
