import { Component, useCallback, useEffect, useState, type ComponentProps } from "react";
import { useDraft, useEditor } from "../../hooks/use-editor-store";
import { BsArrowBarLeft } from "react-icons/bs";
import type { ElementSelectedPayload } from "@enpage/sdk/browser/types";
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
import type { BlockManifest } from "@enpage/sdk/browser/components/base/ep-block-base";
import { useLocalStorage } from "usehooks-ts";

function Inspector() {
  const editor = useEditor();
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  if (!editor.selectedElement) {
    return <InspectorIntro />;
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-700 shadow-xl rounded overflow-hidden">
      <div className="flex justify-between bg-gray-200 dark:bg-dark-800 pr-0">
        <h2 className="py-1.5 px-2 flex justify-between items-center text-sm capitalize text-gray-600 dark:text-gray-200 flex-1 select-none">
          {editor.selectedElement?.attributes["ep-label"]}
          <TbHelp
            className="w-5 h-5  dark:text-white opacity-50 dark:hover:opacity-80 cursor-pointer"
            onClick={() => setShowHelp(!showHelp)}
          />
        </h2>
        <button
          type="button"
          className="justify-self-end self-stretch p-2 hover:text-white aspect-square text-white/90 md:hidden"
          onClick={() => editor.setSelectedElement()}
        >
          <BsArrowBarLeft className="w-auto" size={22} />
        </button>
      </div>
      {editor.selectedElement && <ElementInspector element={editor.selectedElement} />}
    </div>
  );
}

function InspectorIntro() {
  const draft = useDraft();
  return (
    <div>
      <p>Help me</p>
      <p>html {draft.html?.substring(0, 30)}</p>
      <p>body {draft.body?.substring(0, 30)}</p>
    </div>
  );
}

export default function InspectorWrapper() {
  const editor = useEditor();
  const isDesktop = useIsLargeDevice();

  const onClosed = useCallback(() => {
    editor.setSelectedElement();
  }, [editor]);

  if (!isDesktop) {
    return (
      <HorizontalDrawer open={!!editor.selectedElement} from="left" noBackdrop onClosed={onClosed}>
        <Inspector />
      </HorizontalDrawer>
    );
  }
  return (
    <FloatingPanel className="left-5 top-5">
      <Inspector />
    </FloatingPanel>
  );
}

const baseUiSchema: UiSchema = {
  "ui:submitButtonOptions": { norender: true },
};

function ElementInspector({ element }: { element: ElementSelectedPayload["element"] }) {
  const [state, setState] = useState(element.attributes);
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", false);

  const onChange = (data: IChangeEvent<any, any, any>, id?: string) => {
    console.log("changed", data, id);
  };

  if (element.attributes["ep-block-type"] === "site-background") {
    return <PanelItemSiteBackground element={element} />;
  }
  if (element.manifest) {
    const uiSchema = Object.assign({}, baseUiSchema, buildUiSchemaFromManifest(element.manifest));
    uiSchema["ui:classNames"] ||= "";
    uiSchema["ui:classNames"] += showHelp ? " hide-help" : "";
    // console.log("props", element.manifest.properties.props);
    return (
      <Form
        autoComplete="off"
        className="inspector-form"
        formData={state}
        schema={element.manifest.properties.props}
        validator={validator}
        uiSchema={uiSchema}
        onChange={onChange}
        fields={customFields}
        onSubmit={(e) => console.log("onSubmit", e)}
        onError={(e) => console.log("onError", e)}
      />
    );
  }
  return <pre className="text-xs">{JSON.stringify(element, null, 2)}</pre>;
}

function buildUiSchemaFromManifest(manifest: BlockManifest) {
  return Object.entries(manifest.properties.props.properties).reduce((acc, [field, value]) => {
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
