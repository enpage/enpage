import clsx from "clsx";
import { useEditor } from "../../hooks/use-editor-store";
import { HorizontalDrawer } from "../Drawer";
import * as all from "@enpage/sdk/browser/components/blocks/all";
import { Value } from "@sinclair/typebox/value";
import { useCallback, type ComponentProps } from "react";
import { useIsLargeDevice } from "../../hooks/use-is-device-type";
import { FloatingPanel } from "../FloatingPanel";

const FORCE_DRAWER = false;

export default function BlocksLibraryWrapper() {
  const editor = useEditor();
  const isDesktop = useIsLargeDevice();

  if (!isDesktop || FORCE_DRAWER) {
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
        <BlocksLibrary />
      </HorizontalDrawer>
    );
  }
  return (
    <FloatingPanel className="right-5 top-5">
      <BlocksLibrary />
    </FloatingPanel>
  );
}

export function BlocksLibrary() {
  const editor = useEditor();
  const isTouchDevice = "ontouchstart" in window;

  return (
    <div
      className={clsx(
        "flex flex-col bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-700 shadow-xl rounded overflow-hidden",
      )}
    >
      <h2 className="py-1.5 px-2 text-sm capitalize bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-gray-200 flex-1 select-none">
        Library
      </h2>
      <div
        className="grid gap-1.5 p-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        }}
      >
        {Object.entries(all).map(([key, blockImport]) => {
          const block = Value.Create(blockImport.manifest);
          return (
            <button
              draggable={isTouchDevice === false}
              key={block.type}
              data-block={encodeURIComponent(JSON.stringify(block))}
              data-manifest={encodeURIComponent(JSON.stringify(blockImport.manifest))}
              type="button"
              className="rounded border border-transparent hover:border-primary-600 bg-primary-100
                            dark:bg-dark-700 cursor-grab active:cursor-grabbing touch-none select-none
                            pointer-events-auto"
            >
              {/*
                - pointer-events-none is needed for Safari iOS to work!
              */}
              <div
                className={clsx(
                  "h-full w-full flex flex-col px-1 py-2 items-center gap-0.5 rounded-[inherit] select-none",
                  {
                    "pointer-events-none": isTouchDevice,
                  },
                )}
              >
                <span
                  className="w-7 h-7 text-primary-600 dark:text-primary-400 [&>svg]:w-auto [&>svg]:h-7 inline-block"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: block.icon }}
                />
                <span className="whitespace-nowrap text-sm">{block.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
