import { useAttributes, useAttributesSchema, useDraft } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import type { IChangeEvent } from "@rjsf/core";
import { css, tx } from "@upstart.gg/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import validator from "@rjsf/validator-ajv8";
import { customFields } from "./json-form/fields";
import { jsonFormClass } from "./json-form/form-class";
import { ObjectFieldTemplate } from "./CustomObjectFieldTemplate";
import { Spinner } from "@upstart.gg/style-system/system";
import { lazy, Suspense, useEffect, useState } from "react";

import "./json-form/json-form.css";

const LazyForm = lazy(() => import("@rjsf/core"));

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
  const uiSchema = createUiSchema(filteredAttrSchema);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Defer the form rendering to the next frame
    const timeoutId = requestAnimationFrame(() => {
      setShouldRender(true);
    });

    return () => cancelAnimationFrame(timeoutId);
  }, []);

  const LoadingSpinner = () => (
    <div className="flex flex-1 items-center justify-center w-full h-full">
      <Spinner size="3" />
    </div>
  );

  if (!shouldRender) {
    return <LoadingSpinner />;
  }

  const onChange = (data: IChangeEvent, id?: string) => {
    console.log("changed attr (%s) %o", id, data.formData);
    draft.updateAttributes(data.formData);
  };

  return (
    <div className={tx(tabContentScrollClass, "h-full overflow-y-auto overscroll-none")}>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyForm
          autoComplete="off"
          className={tx("json-form overscroll-contain animate-fade-in", jsonFormClass)}
          formData={attributes}
          schema={filteredAttrSchema}
          formContext={{}}
          validator={validator}
          uiSchema={uiSchema}
          onChange={onChange}
          // fields={customFields}
          templates={{ ObjectFieldTemplate }}
          onSubmit={(e) => console.log("onSubmit", e)}
          onError={(e) => console.log("onError", e)}
        />
      </Suspense>
    </div>
  );
}
