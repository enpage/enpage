import { useAttributes, useAttributesSchema, useDraft } from "@enpage/sdk/browser/use-editor";
import { sortJsonSchemaProperties } from "../utils/sort-json-schema-props";
import type { Brick } from "@enpage/sdk/shared/bricks";
import Form, { type IChangeEvent } from "@rjsf/core";
import { tw, tx } from "@enpage/sdk/browser/twind";
import { createUiSchema } from "./json-form/ui-schema";
import validator from "@rjsf/validator-ajv8";
import { customFields } from "./json-form/fields";
import { jsonFormClass } from "./json-form/form-class";

import "./json-form/json-form.css";

export default function SettingsForm() {
  const attributes = useAttributes();
  const attrSchema = useAttributesSchema();
  const filteredAttrSchema = sortJsonSchemaProperties(attrSchema);

  const onChange = (data: IChangeEvent<any, any, any>, id?: string) => {
    console.log("changed attr", data, id);
    // draft.updateBrickProps(brick.id, data.formData);
  };

  const uiSchema = createUiSchema(filteredAttrSchema);

  console.log("attrSchema", attrSchema);

  return (
    <Form
      autoComplete="off"
      className={tx("json-form overscroll-contain", jsonFormClass)}
      formData={attributes}
      schema={filteredAttrSchema}
      formContext={{}}
      validator={validator}
      uiSchema={uiSchema}
      onChange={onChange}
      fields={customFields}
      onSubmit={(e) => console.log("onSubmit", e)}
      onError={(e) => console.log("onError", e)}
    />
  );
}
