import { useAttributes, useAttributesSchema, useDraft } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import { css, tx } from "@upstart.gg/style-system/twind";
import { createUiSchema } from "./json-form/ui-schema";
import { Spinner } from "@upstart.gg/style-system/system";
import { lazy, Suspense, useEffect, useState } from "react";
import "./json-form/json-form.css";
import { FormRenderer, getFormComponents } from "./json-form/form";
import type { Attributes, JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";

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

  const onChange = (data: Record<string, unknown>, propertyChanged: string) => {
    console.log("changed attr %o", data);
    draft.updateAttributes(data as Attributes);
  };

  const elements = getFormComponents({
    brickId: "settings",
    formSchema: filteredAttrSchema as JSONSchemaType<unknown>,
    formData: attributes,
    onChange,
  });

  return (
    <div className={tx(tabContentScrollClass, "h-full overflow-y-auto overscroll-none pb-10")}>
      <form className={tx("px-3 flex flex-col gap-3")}>
        <FormRenderer components={elements} brickId={"settings"} />
      </form>
    </div>
  );
}
