import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import Toolbar from "./Toolbar";
import { useMemo, useRef, useState, type ComponentProps } from "react";
import Inspector from "./inspector/Inspector";
import { DeviceFrame, Preview } from "./Preview";
import BlocksLibrary from "./blocks-library/BlocksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import { cn } from "../utils/component-utils";
import { Settings } from "./Settings";
import { VscLayoutSidebarLeft, VscLayoutSidebarRight } from "react-icons/vsc";

import clsx from "clsx";
import "./Editor.css";

export default function Editor({ className, ...props }: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div
      id="editor"
      className={cn("h-dvh max-h-dvh overflow-hidden flex relative flex-1", className)}
      {...props}
      ref={rootRef}
    >
      <Panel />
      <Main />
    </div>
  );
}

type PanelProps = ComponentProps<"aside">;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const editor = useEditor();
  const [position, setPosition] = useState<"left" | "right">("left");
  const [visibleSection, setVisibleSection] = useState<"library" | "inspector">("library");

  const btnClass = `border border-transparent border-l-0 text-sm bg-primary-600 font-semibold py-3 leading-none rounded-r`;
  const btnInactiveClass = `hover:bg-primary-700 text-white/90 hover:bg-primary-700`;
  const btnActiveClass = `bg-white dark:bg-dark-700 !text-primary-600 dark:!text-white  border-primary-500 dark:border-dark-500 cursor-default ${position === "left" ? "-mr-px" : "-ml-px"}`;
  const btnDynClass = `${position === "left" ? "ml-1" : "mr-1"}`;

  return (
    <aside
      className={clsx(
        `min-w-[300px] w-[18dvw] max-w-[18dvw] 2xl:max-w-[14dvw] z-10 fixed top-0 bottom-0 floating-panel flex shadow-2xl bg-gray-50/80 dark:bg-dark-700 border border-gray-300 dark:border-dark-700`,
        {
          "left-0": position === "left",
          "right-0": position === "right",
          "flex-row-reverse": position === "right",
        },
      )}
      {...props}
    >
      <div
        className={clsx(
          "w-8 flex shrink-0 flex-col gap-3 pt-8 pb-3 backdrop-blur-md bg-primary-200 dark:bg-dark-900 border-primary-500 dark:border-dark-400 justify-start",
          {
            "border-r": position === "left",
            "border-l": position === "right",
          },
        )}
      >
        <button
          type="button"
          className={clsx(
            btnClass,
            btnDynClass,
            visibleSection === "library" ? btnActiveClass : btnInactiveClass,
          )}
          style={{ writingMode: "vertical-rl", rotate: position === "left" ? "180deg" : undefined }}
          onClick={() => setVisibleSection("library")}
        >
          Library
        </button>
        <button
          type="button"
          className={clsx(
            btnClass,
            btnDynClass,
            visibleSection === "inspector" ? btnActiveClass : btnInactiveClass,
          )}
          style={{ writingMode: "vertical-rl", rotate: position === "left" ? "180deg" : undefined }}
          onClick={() => setVisibleSection("inspector")}
        >
          Inspector
        </button>
        <div className="flex-1" />
        <button
          type="button"
          title="Toggle panel position"
          className="self-center w-full text-center inline-flex justify-center py-1 hover:bg-primary-500 text-primary-600 dark:text-primary-400 hover:text-white dark:hover:text-white"
          onClick={() => setPosition(position === "left" ? "right" : "left")}
        >
          {position === "left" ? (
            <VscLayoutSidebarRight className="w-6 h-6 " />
          ) : (
            <VscLayoutSidebarLeft className="w-6 h-6 " />
          )}
        </button>
      </div>
      <div className="flex flex-col flex-1">
        {visibleSection === "library" && <BlocksLibrary />}
        {visibleSection === "inspector" && <Inspector />}
      </div>
    </aside>
  );
}

function Main() {
  const editor = useEditor();

  // Initialize preview mode depending on the user's editing device
  usePreviewModeInit();

  return (
    <main className="flex flex-col flex-auto max-lg:max-w-[50dvw] max-lg:flex-col-reverse">
      {/* <Toolbar /> */}
      {editor.previewMode && (
        <DeviceFrame previewMode={editor.previewMode}>
          <Preview previewMode={editor.previewMode} />
        </DeviceFrame>
      )}
      {/* <Settings /> */}
    </main>
  );
}
