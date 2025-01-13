import type { UiSchema, ObjectFieldTemplateProps } from "@rjsf/utils";
import { tx } from "@upstart.gg/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import type { AnySchemaObject } from "@upstart.gg/sdk/shared/ajv";

interface GroupedField {
  content: React.ReactElement;
  uiSchema?: UiSchema;
  hidden?: boolean;
}
interface GroupedFields {
  [key: string]: GroupedField[];
}
export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { properties, title } = props;
  const groupTitles: Record<string, string | null> = {};

  // Group fields by their ui:group
  const groupedFields = properties.reduce<GroupedFields>((acc, prop) => {
    const group = (prop.content.props.uiSchema?.["ui:group"] as string) || "other";
    groupTitles[group] = prop.content.props.uiSchema?.["ui:group:title"] ?? "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(prop);
    return acc;
  }, {});

  const isRoot = props.idSchema.$id === "root";

  if (!isRoot) {
    // const uiSchema = createUiSchema(props.schema as AnySchemaObject);

    console.log("Custom obj field", props);
    console.log("groupedFieldsgroupedFields", groupedFields);
    return Object.entries(groupedFields).map(([group, fields]) => (
      <div key={group} className={tx({ "-mx-3 -mt-3": !isRoot })}>
        {title && (
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
            {title}
          </h3>
        )}
        <div className="object-fields">
          {fields
            .filter((f) => !f.hidden)
            .map((field, index) => (
              <div key={index}>{field.content}</div>
            ))}
        </div>
      </div>
    ));
  }

  return (
    <div className={tx("rjsf-sections", { "-mx-3": !isRoot })}>
      {title && isRoot && <h2 className="text-sm bg-upstart-200 dark:bg-dark-700 px-2">{title}</h2>}
      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="form-section">
          {/* Render group title only when there is at least one non-hidden element */}
          {fields.some((field) => !field.hidden) && isRoot && (
            <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
              {groupTitles[group]}
            </h3>
          )}
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
