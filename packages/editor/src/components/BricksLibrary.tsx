import { tx, css, tw } from "@enpage/sdk/browser/twind";
import { useEditor } from "@enpage/sdk/browser/use-editor";
import { manifests } from "@enpage/sdk/browser/bricks/all-manifests";
import { Value } from "@sinclair/typebox/value";
import { WiStars } from "react-icons/wi";
import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  TextField,
  Select,
  useAutoAnimate,
  Tooltip,
} from "@enpage/style-system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { useState } from "react";
import type { BrickManifest } from "@enpage/sdk/browser/bricks/manifest";
import type { Static } from "@sinclair/typebox";
import { ScrollablePanelTab } from "./ScrollablePanelTab";

const tabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});

export default function BlocksLibrary() {
  const editor = useEditor();
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [brickPrompt, setBrickPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBrick = async () => {
    if (!brickPrompt) {
      return;
    }
    setIsGenerating(true);
    // todo...
    setIsGenerating(false);
  };

  const onDragStart = (brick: Static<BrickManifest>, e: React.DragEvent<HTMLButtonElement>) => {
    // firefox needs this to allow dragging
    e.dataTransfer.setData("text/plain", "");
    editor.setDraggingBrick(brick);
  };

  return (
    <Tabs.Root defaultValue="library">
      <Tabs.List className="sticky top-0 !bg-white z-50">
        <Tabs.Trigger value="library" className="!flex-1">
          Library
        </Tabs.Trigger>
        <Tabs.Trigger value="ai" className="!flex-1">
          Upstart AI <BsStars className="ml-1 w-4 h-4 text-upstart-600" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="library">
        {shouldDisplayLibraryCallout && (
          <Callout.Root size="1">
            <Callout.Icon>
              <TbDragDrop className="w-8 h-8 mt-3 stroke-1" />
            </Callout.Icon>
            <Callout.Text>Drag and drop blocks to add them to your page.</Callout.Text>
          </Callout.Root>
        )}

        <div
          className={tx("flex flex-col max-h-[calc(100dvh/2-99px)] overflow-y-auto", tabContentScrollClass)}
        >
          <h3 className="text-sm bg-upstart-100 text-gray-700 px-2 py-1 sticky top-0 z-[999]">Base bricks</h3>
          <div
            className="grid gap-1 p-1.5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            }}
          >
            {Object.values(manifests).map((blockImport) => {
              const block = Value.Create(blockImport);
              return (
                <Tooltip content={block.description} key={block.type}>
                  <button
                    draggable={true}
                    onDragStart={onDragStart.bind(null, block)}
                    data-block={encodeURIComponent(JSON.stringify(block))}
                    data-manifest={encodeURIComponent(JSON.stringify(blockImport))}
                    type="button"
                    className="rounded border border-transparent hover:border-upstart-600 bg-upstart-100
                            dark:bg-dark-700 cursor-grab active:cursor-grabbing touch-none select-none
                            pointer-events-auto"
                  >
                    <div
                      className={tx(
                        "h-full w-full flex flex-col px-1 py-2 items-center gap-0.5 rounded-[inherit] select-none",
                      )}
                    >
                      <span
                        className="w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{ __html: block.icon }}
                      />
                      <span className="whitespace-nowrap text-xs">{block.title}</span>
                    </div>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div
          className={tx(
            "flex flex-col max-h-[calc(100dvh/2-99px)] bg-red-700 overflow-y-auto",
            tabContentScrollClass,
          )}
        >
          <h3 className="text-sm bg-upstart-100 text-gray-700 px-2 py-1 sticky top-0 z-[999]">Widgets</h3>
        </div>
      </Tabs.Content>
      <ScrollablePanelTab tab="ai" className="p-2">
        <Callout.Root size="1">
          <Callout.Icon>
            <WiStars className="w-8 h-8 mt-3" />
          </Callout.Icon>
          <Callout.Text>Tell AI what you want and it will generate a brick for you!</Callout.Text>
        </Callout.Root>
        <TextArea
          onInput={(e) => {
            setBrickPrompt(e.currentTarget.value);
          }}
          className="w-full my-2 h-24"
          size="2"
          placeholder="Add an image of delivery guy"
          spellCheck={false}
        />
        <Button
          size="2"
          disabled={brickPrompt.length < 10 || isGenerating}
          className="block !w-full"
          onClick={generateBrick}
        >
          <Spinner loading={isGenerating}>
            <BsStars className="w-4 h-4" />
          </Spinner>
          {isGenerating ? "Generating themes" : "Generate a brick"}
        </Button>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}
