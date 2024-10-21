import { Component, useCallback, useEffect, useState, type ComponentProps } from "react";
import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import { BsArrowBarLeft } from "react-icons/bs";
import { manifests } from "@enpage/sdk/browser/bricks/all-manifests";
import { PanelItemSiteBackground } from "./PanelItemSiteBackground";
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

function ElementInspector({ brick }: { brick: Brick }) {
  const [state, setState] = useState(brick.props);
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  const onChange = (data: IChangeEvent<any, any, any>, id?: string) => {
    console.log("changed", data, id);
  };

  if (brick.type === "site-background") {
    // @ts-ignore
    return <PanelItemSiteBackground brick={brick} manifest={manifests[brick.type]} />;
  }
  if (brick.manifest) {
    const uiSchema = buildUiSchemaFromManifest(brick.manifest.properties.props);
    uiSchema["ui:classNames"] ||= "";
    uiSchema["ui:classNames"] += showHelp ? " hide-help" : "";

    console.log("uiSchema", uiSchema);
    // console.log("props", element.manifest.properties.props);
    return (
      <Form
        autoComplete="off"
        className="inspector-form"
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
