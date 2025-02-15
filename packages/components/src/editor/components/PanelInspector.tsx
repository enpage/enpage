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

export default function Inspector() {
  const brick = useSelectedBrick();
  const { deselectBrick } = useDraftHelpers();
  const { hidePanel } = useEditorHelpers();
  const previewMode = usePreviewMode();
  const [selectedTab, setSelectedTab] = useLocalStorage("inspector_tab", "preset");
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
    <Tabs.Root defaultValue={selectedTab} onValueChange={setSelectedTab}>
      <Tabs.List className="sticky top-0 z-50">
        <Tabs.Trigger value="preset" className="!flex-1">
          Preset
        </Tabs.Trigger>
        <Tabs.Trigger value="style" className="!flex-1">
          Settings
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
        {brick.type === "text" && (
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
          <h2 className="py-1.5 px-2 flex justify-between bg-gradient-to-t from-gray-200 to-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {manifest.properties.title.const}
          </h2>
          <span className="text-xs text-gray-400">{}</span>
        </div>
        {previewMode === "mobile" && (
          <Callout.Root size="1" className="m-2">
            <Callout.Text size="1">
              <strong>Warning</strong>: You are editing the mobile settings. Any changes here will only affect
              how the brick appears on mobile devices. Yellow-highlighted fields are mobile-specific
              customizations, while other fields inherit their values from the desktop version.
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
  // const formData = useMemo(
  //   () => ({ ...brickDefaults.props, ...(brickInfo?.props ?? {}) }),
  //   [brickInfo, brickDefaults],
  // );

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
    draft.updateBrickProps(brick.id, data, previewMode === "mobile");
  };

  const manifest = manifests[brick.type];

  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
    return null;
  }

  const mobileFormData = previewMode === "mobile" ? brickInfo.mobileProps : undefined;

  const elements = getFormComponents({
    brickId: brick.id,
    formSchema: manifest.properties.props as unknown as JSONSchemaType<unknown>,
    formData: brickInfo.props,
    mobileFormData,
    onChange,
  });

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer components={elements} brickId={brick.id} />
    </form>
  );
}
