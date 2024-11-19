import { useAttributes, useAttributesSchema, useDraft, usePreviewMode } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "../utils/sort-json-schema-props";
import Form, { type IChangeEvent } from "@rjsf/core";
import { css, tx } from "@enpage/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import validator from "@rjsf/validator-ajv8";
import { customFields } from "./json-form/fields";
import { jsonFormClass } from "./json-form/form-class";
import { CustomObjectFieldTemplate } from "./CustomObjectFieldTemplate";

import "./json-form/json-form.css";

const tabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});

export default function SettingsForm() {
  const draft = useDraft();
  const attributes = useAttributes();
  const attrSchema = useAttributesSchema();
  const filteredAttrSchema = sortJsonSchemaProperties(attrSchema);

  const onChange = (data: IChangeEvent, id?: string) => {
    console.log("changed attr (%s) %o", id, data.formData);
    draft.updateAttributes(data.formData);
  };

  const uiSchema = createUiSchema(filteredAttrSchema);

  return (
    <div className={tx(tabContentScrollClass, "overflow-y-auto overscroll-none")}>
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
        templates={{ ObjectFieldTemplate: CustomObjectFieldTemplate }}
        onSubmit={(e) => console.log("onSubmit", e)}
        onError={(e) => console.log("onError", e)}
      />
    </div>
  );
}
