import { tx, css, tw } from "@enpage/sdk/browser/twind";
import { useEditor } from "@enpage/sdk/browser/use-editor";
import { manifests } from "@enpage/sdk/browser/bricks/all-manifests";
import { Value } from "@sinclair/typebox/value";
import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  TextField,
  Select,
  useAutoAnimate,
} from "@enpage/style-system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../../hooks/use-callout-view-counter";

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
  const isTouchDevice = "ontouchstart" in window;
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");

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
      <Tabs.Content
        value="library"
        className={tx("p-2 h-[calc(100dvh-40px)] overflow-y-auto", tabContentScrollClass)}
      >
        {shouldDisplayLibraryCallout && (
          <Callout.Root size="1">
            <Callout.Icon>
              <TbDragDrop className="w-8 h-8 mt-3 stroke-1" />
            </Callout.Icon>
            <Callout.Text>Drag and drop blocks to add them to your page.</Callout.Text>
          </Callout.Root>
        )}

        <div className={tx("flex flex-col")}>
          <div
            className="grid gap-1 p-1.5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            }}
          >
            {Object.values(manifests).map((blockImport) => {
              const block = Value.Create(blockImport);
              return (
                <button
                  draggable={isTouchDevice === false}
                  key={block.type}
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
                      {
                        "pointer-events-none": isTouchDevice,
                      },
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
              );
            })}
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
