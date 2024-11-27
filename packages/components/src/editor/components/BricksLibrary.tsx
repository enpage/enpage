import { tx, css } from "@upstart.gg/style-system/twind";
import { useDraft, useEditor } from "../hooks/use-editor";
import { manifests } from "~/shared/bricks/all-manifests";
import { Value } from "@sinclair/typebox/value";
import { WiStars } from "react-icons/wi";
import { Tabs, Button, Callout, TextArea, Spinner, Tooltip } from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/bricks";
import type { Static } from "@sinclair/typebox";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import interact from "interactjs";

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
  const draft = useDraft();
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [brickPrompt, setBrickPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const interactable = useRef<Interact.Interactable | null>(null);
  const ghost = useRef<HTMLElement | null>(null);

  useEffect(() => {
    interactable.current = interact(".draggable-brick");
    interactable.current.draggable({
      // inertia: true,
      autoScroll: {
        enabled: false,
      },
      // manualStart: true,
      listeners: {
        start: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;
          const brickType = target.dataset.brickType;
          console.log("drag start", brickType, target.clientTop);

          const clone = event.target.cloneNode(true) as HTMLElement;
          clone.classList.add("clone");

          // Position clone at original element's position
          const rect = event.target.getBoundingClientRect();
          clone.id = "library-brick-ghost";
          clone.style.left = `${rect.left}px`;
          clone.style.top = `${rect.top}px`;
          clone.style.position = "absolute";
          clone.style.zIndex = "999";
          clone.style.width = `${rect.width}px`;
          clone.style.height = `${rect.height}px`;

          // Store reference to clone
          // @ts-ignore
          event.target.cloneElement = clone;

          document.body.appendChild(clone);
          // editor.setDraggingBrick(brick);
        },
        move: (event: Interact.InteractEvent) => {
          // @ts-ignore
          const clone = event.target.cloneElement as HTMLElement | null;
          if (!clone) {
            return;
          }

          // Get current position of clone
          const position = {
            x: parseFloat(clone.style.left) || 0,
            y: parseFloat(clone.style.top) || 0,
          };

          // Update clone position
          clone.style.left = `${position.x + event.dx}px`;
          clone.style.top = `${position.y + event.dy}px`;
        },
        end(event: Interact.InteractEvent) {
          // Remove clone when drag ends
          // @ts-ignore
          const clone = event.target.cloneElement as HTMLElement | null;
          if (clone) {
            clone.remove();
          }
        },
      },
    });

    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);

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

  console.log({ manifests });

  return (
    <Tabs.Root defaultValue="library">
      <Tabs.List className="sticky top-0 z-50">
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
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
            Base bricks
          </h3>
          <div
            className="grid gap-1 p-1.5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            }}
          >
            {Object.values(manifests)
              .filter((m) => m.properties.kind.const === "brick")
              .map((brickImport) => {
                const brick = Value.Create(brickImport);
                return (
                  <Tooltip content={brick.description} key={brick.type}>
                    <DraggableBrick brick={brick} />
                  </Tooltip>
                );
              })}
          </div>
        </div>
        <div
          className={tx("flex flex-col max-h-[calc(100dvh/2-99px)] overflow-y-auto", tabContentScrollClass)}
        >
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
            Widgets
          </h3>
          <div
            className="grid gap-1 p-1.5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            }}
          >
            {Object.values(manifests)
              .filter((m) => m.properties.kind.const === "widget")
              .map((brickImport) => {
                const brick = Value.Create(brickImport);
                return (
                  <Tooltip content={brick.description} key={brick.type}>
                    <DraggableBrick brick={brick} />
                  </Tooltip>
                );
              })}
          </div>
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

type DraggableBrickProps = {
  brick: Static<BrickManifest>;
};
const DraggableBrick = forwardRef<HTMLButtonElement, DraggableBrickProps>(({ brick }, ref) => {
  return (
    <button
      ref={ref}
      data-brick-type={brick.type}
      data-brick-min-w={brick.minWidth}
      data-brick-min-h={brick.minHeight}
      data-brick-preferred-w={brick.preferredWidth}
      data-brick-preferred-h={brick.preferredHeight}
      type="button"
      className="rounded border border-transparent hover:border-upstart-600
          bg-white dark:bg-dark-700 cursor-grab active:cursor-grabbing touch-none select-none
          pointer-events-auto transition draggable-brick [&:is(.clone)]:(opacity-80 !bg-white)"
    >
      <div
        className={tx(
          "h-full w-full flex flex-col px-1 py-2 items-center gap-0.5 rounded-[inherit] select-none",
        )}
      >
        <span
          className="w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: brick.icon }}
        />
        <span className="whitespace-nowrap text-xs">{brick.title}</span>
      </div>
    </button>
  );
});
