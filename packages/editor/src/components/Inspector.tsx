import { Component, useCallback, useEffect, useState, type ComponentProps } from "react";
import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import { BsArrowBarLeft } from "react-icons/bs";
import { HorizontalDrawer } from "./Drawer";
import { useIsLargeDevice } from "../hooks/use-is-device-type";
import Form, { type IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import type { RegistryFieldsType, UiSchema, FieldProps } from "@rjsf/utils";
import { customFields } from "./json-form/fields";
import { TbHelp } from "react-icons/tb";
import { useLocalStorage } from "usehooks-ts";
import type { Brick } from "@enpage/sdk/shared/bricks";
import { tw, tx } from "@enpage/sdk/browser/twind";
import { createUiSchema } from "./json-form/ui-schema";
import { jsonFormClass } from "./json-form/form-class";

import "./json-form/json-form.css";
import { type BrickType, manifests } from "@enpage/sdk/browser/bricks/all-manifests";

export default function Inspector() {
  const editor = useEditor();
  const [showHelp, setShowHelp] = useLocalStorage("inspector.show-help", true, {
    initializeWithValue: true,
  });

  if (!editor.selectedBrick) {
    return null;
  }

  const manifest = manifests[editor.selectedBrick.type as BrickType];

  return (
    <div>
      <div className="flex justify-between bg-gray-200 dark:bg-dark-800 pr-0">
        <h2 className="py-1.5 px-2 flex justify-between items-center font-medium text-sm capitalize text-gray-600 dark:text-gray-200 flex-1 select-none">
          {manifest.properties.title.const}
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
      <ElementInspector brick={editor.selectedBrick} showHelp={showHelp} />
    </div>
  );
}

function ElementInspector({ brick, showHelp }: { brick: Brick; showHelp: boolean }) {
  const draft = useDraft();
  const [state, setState] = useState(brick.props);

  const onChange = (data: IChangeEvent<any, any, any>, id?: string) => {
    // console.log("changed", data, id);
    draft.updateBrickProps(brick.id, data.formData);
  };

  const manifest = manifests[brick.type as BrickType];

  console.log("manifest", manifest);

  if (manifest) {
    const uiSchema = createUiSchema(manifest.properties.props);
    console.log("uiSchema", uiSchema);
    return (
      <Form
        autoComplete="off"
        className={tx("json-form", jsonFormClass, showHelp && "hide-help")}
        formData={state}
        schema={manifest.properties.props}
        formContext={{ brickId: brick.id }}
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
