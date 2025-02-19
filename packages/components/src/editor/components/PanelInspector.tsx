import {
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  useGetBrick,
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { Callout, IconButton, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { getFormComponents, FormRenderer } from "./json-form/form";
import { IoCloseOutline } from "react-icons/io5";
import type { JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import { useLocalStorage } from "usehooks-ts";
import { BsStars } from "react-icons/bs";
import PresetsView from "./PresetsView";
import { useCallback, useMemo } from "react";

export default function Inspector() {
  const brick = useSelectedBrick();
  const { deselectBrick } = useDraftHelpers();
  const { hidePanel } = useEditorHelpers();
  const previewMode = usePreviewMode();
  const [selectedTab, setSelectedTab] = useLocalStorage(
    "inspector_tab",
    previewMode === "desktop" ? "preset" : "style",
  );
  const draft = useDraft();

  if (!brick) {
    return null;
  }

  const manifest = manifests[brick.type];
  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
    deselectBrick();
    hidePanel("inspector");
    return null;
  }

  return (
    <Tabs.Root
      defaultValue={previewMode === "desktop" ? selectedTab : "style"}
      onValueChange={setSelectedTab}
    >
      <Tabs.List className="sticky top-0 z-50">
        {previewMode === "desktop" && (
          <Tabs.Trigger value="preset" className="!flex-1">
            Preset
          </Tabs.Trigger>
        )}
        <Tabs.Trigger value="style" className="!flex-1">
          {previewMode === "mobile" ? "Mobile styles" : "Styles"}
        </Tabs.Trigger>
        {/* {manifest.properties.datasource && (
          <Tabs.Trigger value="datasource" className="!flex-1">
            Data source
          </Tabs.Trigger>
        )}
        {manifest.properties.datarecord && (
          <Tabs.Trigger value="datarecord" className="!flex-1">
            Data record
          </Tabs.Trigger>
        )} */}
        {previewMode === "desktop" && brick.type === "text" && (
          <Tabs.Trigger value="ai" className="!flex-1">
            AI <BsStars className={tx("ml-1 w-4 h-4 text-upstart-600")} />
          </Tabs.Trigger>
        )}
        <IconButton
          title="Close"
          className="self-center items-center justify-center inline-flex !mr-1 !mt-2"
          size="1"
          variant="ghost"
          color="gray"
          onClick={() => {
            deselectBrick();
            hidePanel();
          }}
        >
          <IoCloseOutline className="w-4 h-4 text-gray-400 hover:text-gray-700" />
        </IconButton>
      </Tabs.List>
      <ScrollablePanelTab tab="preset">
        <div className="flex justify-between pr-0">
          <h2 className="py-1.5 px-2 flex justify-between bg-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {manifest.properties.title.const}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </h2>
        </div>
        <div className={tx("p-2 flex flex-col gap-3")}>
          <Callout.Root size="1">
            <Callout.Text size="1">
              <span className="font-semibold">Style presets</span> are pre-configured settings that can be
              applied to your bricks to quickly change their appearance. Start from a preset and customize it
              further in the <span className="font-semibold">Settings</span> tab.
            </Callout.Text>
          </Callout.Root>
          <PresetsView
            onChoose={(preset) => {
              console.log("onChoose(%o)", preset);
              draft.updateBrickProps(brick.id, preset, previewMode === "mobile");
            }}
          />
        </div>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="style">
        <div className="flex justify-between pr-0">
          <h2 className="group py-1.5 px-2 flex justify-between bg-gradient-to-t from-gray-200 to-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {manifest.properties.title.const}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </h2>
        </div>
        {previewMode === "mobile" && (
          <Callout.Root size="1" className="m-2">
            <Callout.Text size="1">
              <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
              the brick appears on mobile devices.
            </Callout.Text>
          </Callout.Root>
        )}
        <ElementInspector brick={brick} />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function ElementInspector({ brick }: { brick: Brick }) {
  const draft = useDraft();
  const getBrick = useGetBrick();
  const brickInfo = getBrick(brick.id);
  const previewMode = usePreviewMode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: draft.updateBrickProps is a stable function
  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChanged: string) => {
      if (!propertyChanged) {
        // ignore changes unrelated to the brick
        return;
      }
      draft.updateBrickProps(brick.id, data, previewMode === "mobile");
    },
    [brick.id],
  );

  const manifest = useMemo(() => manifests[brick.type], [brick.type]);

  if (!brickInfo) {
    console.log("No brick info found for brick: %s", brick.id);
    return null;
  }

  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
    return null;
  }

  const elements = useMemo(
    () =>
      getFormComponents({
        brickId: brick.id,
        formSchema: manifest.properties.props as unknown as JSONSchemaType<unknown>,
        formData: brickInfo.props,
        mobileFormData: previewMode === "mobile" ? brickInfo.mobileProps : undefined,
        filter: (prop) => {
          return previewMode !== "mobile" || prop["ui:responsive"];
        },
        onChange,
      }),
    [manifest, onChange, brick.id, brickInfo, previewMode],
  );

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer components={elements} brickId={brick.id} />
    </form>
  );
}
