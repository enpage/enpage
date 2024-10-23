import { Component, useCallback, useEffect, useState, type ComponentProps } from "react";
import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import { BsArrowBarLeft } from "react-icons/bs";
import { manifests } from "@enpage/sdk/browser/bricks/all-manifests";
import { HorizontalDrawer } from "../Drawer";
import { useIsLargeDevice } from "../../hooks/use-is-device-type";
import Form, { type IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import type { RegistryFieldsType, UiSchema, FieldProps } from "@rjsf/utils";
import { customFields } from "./fields";
import { TbHelp } from "react-icons/tb";

import { useLocalStorage } from "usehooks-ts";
import type { Brick } from "@enpage/sdk/shared/bricks";
import type { BrickManifest } from "@enpage/sdk/browser/bricks/manifest";

import "./Inspector.css";
import { tw, tx } from "@enpage/sdk/browser/twind";

export default function Inspector() {
  const editor = useEditor();
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  if (!editor.selectedBrick) {
    return null;
    // return <InspectorIntro />;
  }

  return (
    <div>
      <div className="flex justify-between bg-gray-200 dark:bg-dark-800 pr-0">
        <h2 className="py-1.5 px-2 flex justify-between items-center text-sm capitalize text-gray-600 dark:text-gray-200 flex-1 select-none">
          {editor.selectedBrick.type}
          <TbHelp
            className="w-5 h-5  dark:text-white opacity-50 dark:hover:opacity-80 cursor-pointer"
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
      <ElementInspector brick={editor.selectedBrick} />
    </div>
  );
}

function InspectorIntro() {
  const draft = useDraft();
  return (
    <div>
      <p>Help me</p>
    </div>
  );
}

export const inspectorFormClass = tx`text-gray-900 dark:text-gray-50
  [&_label]:(text-sm leading-6)
  [&_label.file-title]:(leading-5)
  [&_label.label.file-label]:(mb-0)
  [&_.control-label]:(block mb-1)
  [&_fieldset]:(flex flex-col)
  [&_.form-group]:(px-3 py-4 border-b border-gray-200 dark:border-dark-700)
  [&>.form-group]:(!px-0 !py-0)
  [&_.field-description]:(mt-0 mb-1.5 text-sm text-gray-600 dark:text-white/50 leading-none)
  [&_.form-group.hide-help_.field-description]:(hidden)
  [&_[type="submit"]]:(bg-upstart-600 text-white py-1 px-4 block w-full rounded mt-6)
  [&_input[type="text"]]:(w-full px-1.5 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_input[type="number"]]:(w-full p-2 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_textarea]:(w-full p-2 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
  [&_select]:(w-full p-2 py-1.5 text-sm border border-gray-300 dark:border-transparent dark:bg-dark-800 rounded-md focus:ring-1 focus:border-upstart-500 focus:ring-upstart-500)
`;

function ElementInspector({ brick }: { brick: Brick }) {
  const draft = useDraft();
  const [state, setState] = useState(brick.props);
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  const onChange = (data: IChangeEvent<any, any, any>, id?: string) => {
    console.log("changed", data, id);
    draft.updateBrickProps(brick.id, data.formData);
  };

  if (brick.manifest) {
    const uiSchema = buildUiSchemaFromManifest(brick.manifest.properties.props);
    uiSchema["ui:classNames"] ||= "";
    uiSchema["ui:classNames"] += showHelp ? " hide-help" : "";

    console.log("uiSchema", uiSchema);
    // console.log("props", element.manifest.properties.props);
    return (
      <Form
        autoComplete="off"
        className={tx("inspector-form", inspectorFormClass)}
        formData={state}
        schema={brick.manifest.properties.props}
        validator={validator}
        uiSchema={uiSchema}
        onChange={onChange}
        fields={customFields}
        onSubmit={(e) => console.log("onSubmit", e)}
        onError={(e) => console.log("onError", e)}
      />
    );
  }
  return <pre className="text-xs">{JSON.stringify(brick, null, 2)}</pre>;
}

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

function buildUiSchemaFromManifest(propsManifest: BrickManifest["properties"]["props"]): UiSchema {
  const uiSchema = Object.entries(propsManifest.properties).reduce((acc, [field, value]) => {
    for (const key in value) {
      if (key.startsWith("ui:")) {
        acc[field] ??= {};
        acc[field][key] = value[key];
      }
    }
    return acc;
  }, baseUiSchema as UiSchema);

  return uiSchema;
}
