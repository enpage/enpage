import { useAttributes, useAttributesSchema, useDraft, usePreviewMode } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "../utils/sort-json-schema-props";
import Form, { type IChangeEvent } from "@rjsf/core";
import { css, tx } from "@enpage/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import validator from "@rjsf/validator-ajv8";
import { customFields } from "./json-form/fields";
import { jsonFormClass } from "./json-form/form-class";
import type { ObjectFieldTemplateProps, UiSchema } from "@rjsf/utils";

import "./json-form/json-form.css";

interface GroupedField {
  content: React.ReactElement;
  uiSchema?: UiSchema;
}

interface GroupedFields {
  [key: string]: GroupedField[];
}

const CustomObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { properties, title } = props;
  const groupTitles: Record<string, string | null> = {};

  // Group fields by their ui:group
  const groupedFields = properties.reduce<GroupedFields>((acc, prop) => {
    const group = (prop.content.props.uiSchema?.["ui:group"] as string) || "default";
    groupTitles[group] = prop.content.props.uiSchema?.["ui:group:title"] ?? "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(prop);
    return acc;
  }, {});

  return (
    <div className="rjsf-sections">
      {title && <h2 className="text-sm bg-upstart-200 dark:bg-dark-700 px-2">{title}</h2>}
      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="form-section">
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
            {groupTitles[group]}
          </h3>
          <div className="section-fields">
            {fields.map((field, index) => (
              <div key={index}>{field.content}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

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
    console.log("changed attr", data, id);
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
