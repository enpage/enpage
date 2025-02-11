import { useMemo, useState, memo } from "react";
import { useDraft, useEditor, useGetBrick } from "../hooks/use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { IconButton, Tabs } from "@upstart.gg/style-system/system";
import { manifests, defaults } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { getFormComponents, FormRenderer } from "./json-form/form";
import { IoCloseOutline } from "react-icons/io5";
import type { JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";

export default function Inspector() {
  const editor = useEditor();

  if (!editor.selectedBrick) {
    return null;
  }

  const manifest = manifests[editor.selectedBrick.type];
  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(editor.selectedBrick)}`);
    editor.deselectBrick();
    return null;
  }

  const tabsCount = [
    1,
    manifest.properties.datasource,
    manifest.properties.datarecord,
    editor.selectedBrick.type === "text",
  ].filter(Boolean).length;

  return (
    <Tabs.Root defaultValue="style">
      {tabsCount > 1 && (
        <Tabs.List className="sticky top-0 z-50">
          <Tabs.Trigger value="style" className="!flex-1">
            Style
          </Tabs.Trigger>
          {manifest.properties.datasource && (
            <Tabs.Trigger value="datasource" className="!flex-1">
              Data source
            </Tabs.Trigger>
          )}
          {manifest.properties.datarecord && (
            <Tabs.Trigger value="datarecord" className="!flex-1">
              Data record
            </Tabs.Trigger>
          )}
          {editor.selectedBrick.type === "text" && (
            <Tabs.Trigger value="ai" className="!flex-1">
              Upstart AI
            </Tabs.Trigger>
          )}
        </Tabs.List>
      )}
      <ScrollablePanelTab tab="style">
        <div className="flex justify-between pr-0">
          <h2 className="py-1.5 px-2 flex justify-between bg-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {manifest.properties.title.const}
            <IconButton
              title="Reset"
              size="2"
              variant="ghost"
              color="gray"
              onClick={() => {
                editor.deselectBrick();
              }}
            >
              <IoCloseOutline className="w-4 h-4" />
            </IconButton>
          </h2>
        </div>
        <ElementInspector brick={editor.selectedBrick} />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function ElementInspector({ brick }: { brick: Brick }) {
  const brickDefaults = defaults[brick.type];
  const draft = useDraft();
  const getBrick = useGetBrick();
  const brickInfo = getBrick(brick.id);
  const formData = useMemo(
    () => ({ ...brickDefaults.props, ...(brickInfo?.props ?? {}) }),
    [brickInfo, brickDefaults],
  );

  if (!brickInfo) {
    console.log("No brick info found for brick: %s", brick.id);
    return null;
  }

  const onChange = (data: Record<string, unknown>, propertyChanged: string) => {
    if (!propertyChanged) {
      // ignore changes unrelated to the brick
      return;
    }
    console.log("onChange(%s)", propertyChanged, data, brickInfo);
    draft.updateBrickProps(brick.id, { ...data, lastTouched: Date.now() });
  };

  const manifest = manifests[brick.type];

  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
    return null;
  }

  const elements = getFormComponents({
    brickId: brick.id,
    formSchema: manifest.properties.props as unknown as JSONSchemaType<unknown>,
    formData,
    onChange,
  });

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer components={elements} brickId={brick.id} />
    </form>
  );
}
