import type { UiSchema, ObjectFieldTemplateProps } from "@rjsf/utils";

interface GroupedField {
  content: React.ReactElement;
  uiSchema?: UiSchema;
}
interface GroupedFields {
  [key: string]: GroupedField[];
}
export const CustomObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
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

  return (
    <div className="rjsf-sections">
      {title && <h2 className="text-sm bg-upstart-200 dark:bg-dark-700 px-2">{title}</h2>}
      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="form-section">
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999] border-b border-upstart-200">
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
