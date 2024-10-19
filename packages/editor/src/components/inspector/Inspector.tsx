import { Component, useCallback, useEffect, useState, type ComponentProps } from "react";
import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import { BsArrowBarLeft } from "react-icons/bs";
import { type BrickType, type GenericBrickManifest, manifests } from "@enpage/sdk/browser/bricks/manifests";
import { PanelItemSiteBackground } from "./PanelItemSiteBackground";
import { HorizontalDrawer } from "../Drawer";
import { useIsLargeDevice } from "../../hooks/use-is-device-type";
import { FloatingPanel } from "../FloatingPanel";
import Form, { type IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import type { RegistryFieldsType, UiSchema, FieldProps } from "@rjsf/utils";
import { customFields } from "./fields";
import { TbHelp } from "react-icons/tb";

import "./Inspector.css";
import { useLocalStorage } from "usehooks-ts";
import type { Brick } from "@enpage/sdk/shared/bricks";

export default function Inspector() {
  const editor = useEditor();
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  if (!editor.selectedBrick) {
    return <InspectorIntro />;
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-700 rounded overflow-hidden">
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
      {editor.selectedBrick && <ElementInspector brick={editor.selectedBrick} />}
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

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

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
  if (brick.props.manifest) {
    const uiSchema = Object.assign(
      {},
      baseUiSchema,
      // @ts-ignore
      buildUiSchemaFromManifest(manifests[brick.type as BrickType]),
    );
    uiSchema["ui:classNames"] ||= "";
    uiSchema["ui:classNames"] += showHelp ? " hide-help" : "";
    // console.log("props", element.manifest.properties.props);
    return (
      <Form
        autoComplete="off"
        className="inspector-form"
        formData={state}
        schema={brick.props.manifest}
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

function buildUiSchemaFromManifest(manifest: GenericBrickManifest): UiSchema {
  return Object.entries(manifest).reduce((acc, [field, value]) => {
    // console.log("key", field);
    // console.log("value", value);
    if (value["ui:field"]) {
      acc[field] = {
        "ui:field": value["ui:field"],
      };
    }
    return acc;
  }, {} as UiSchema);
}
