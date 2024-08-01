import clsx from "clsx";
import { useEditor } from "../../hooks/use-editor-store";
import { HorizontalDrawer } from "../Drawer";
import { allBlocks } from "@enpage/sdk/browser/components/blocks/manifest";

export default function BlocksLibrary() {
  const editor = useEditor();
  const isTouchDevice = "ontouchstart" in window;

  return (
    <HorizontalDrawer
      id="blocks-library"
      open={editor.libraryVisible}
      dismissable
      noBackdrop
      onClosed={() => {
        editor.setLibraryVisible(false);
      }}
    >
      <div className={clsx("flex flex-col")}>
        <h1 className="p-2 font-medium bg-enpage-600 capitalize text-white/90">Block library</h1>
        <div
          className="grid gap-1.5 p-2"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          }}
        >
          {Object.entries(allBlocks).map(([key, block]) => (
            <button
              draggable={isTouchDevice === false}
              key={key}
              data-block-type={key}
              data-block-template={block.template}
              type="button"
              className="rounded border border-transparent hover:border-enpage-600 bg-enpage-50
              cursor-grab active:cursor-grabbing touch-none select-none pointer-events-auto"
              style={{
                transform: "translate(0, 0)",
              }}
            >
              {/*
                - pointer-events-none is needed for Safari iOS to work!
              */}
              <div
                className={clsx(
                  "h-full w-full flex p-2 items-center gap-x-1.5 rounded-[inherit] select-none",
                  {
                    "pointer-events-none": isTouchDevice,
                  },
                )}
              >
                <span
                  className="w-7 h-7 text-enpage-600 [&>svg]:w-auto [&>svg]:h-7 inline-block"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: block.icon }}
                />
                <span className="whitespace-nowrap">{block.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </HorizontalDrawer>
  );
}
