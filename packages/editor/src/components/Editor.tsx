import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import Toolbar, { type ToolbarProps } from "./Toolbar";
import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import Inspector from "./inspector/Inspector";
import { DeviceFrame } from "./Preview";
import BlocksLibrary from "./blocks-library/BlocksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import { Settings } from "./Settings";
import { VscLayoutSidebarLeft, VscLayoutSidebarRight } from "react-icons/vsc";
import { VscVersions as AutoHideIcon } from "react-icons/vsc";
import { LuPlus, LuUndo, LuRedo, LuInspect } from "react-icons/lu";
import { GrDocumentConfig } from "react-icons/gr";
import Page from "@enpage/sdk/browser/page";
import { tx } from "@enpage/sdk/browser/twind";
import { useLocalStorage } from "usehooks-ts";
import "./Editor.css";

export default function Editor({ className, ...props }: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);
  const editor = useEditor();
  const [toolbarPos, setToolbarPos] = useLocalStorage<ToolbarProps["position"]>("toolbar-position", "left");

  usePreviewModeInit();
  return (
    <div
      id="editor"
      className={tx("h-dvh max-h-dvh flex relative flex-1", className)}
      {...props}
      ref={rootRef}
    >
      <Panel />
      <Toolbar position={toolbarPos} />
      <div className="flex-1 flex place-content-center z-40">
        {editor.previewMode && (
          <DeviceFrame previewMode={editor.previewMode}>
            <Page />
          </DeviceFrame>
        )}
      </div>
    </div>
  );
}

type PanelProps = ComponentProps<"aside">;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const editor = useEditor();
  const visibleSection = useMemo(
    () => (editor.selectedBrick ? "inspector" : editor.libraryVisible ? "library" : null),
    [editor.selectedBrick, editor.libraryVisible],
  );

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-0 bottom-0 left-[3.7rem] flex shadow-2xl \
        min-w-[300px] w-[18dvw] max-w-[18dvw] 2xl:max-w-[14dvw] transition-all duration-300 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-primary-200 dark:border-dark-700 hover:border-r-0 overflow-auto`,
        {
          "-translate-x-full opacity-0": !visibleSection,
        },
      )}
      {...props}
    >
      <div className={tx("flex flex-col flex-1")}>
        {visibleSection === "library" && <BlocksLibrary />}
        {visibleSection === "inspector" && <Inspector />}
      </div>
    </aside>
  );
}

// function Main() {
//   const editor = useEditor();

//   // Initialize preview mode depending on the user's editing device
//   usePreviewModeInit();

//   return (
//     <main className="flex flex-col flex-auto max-lg:max-w-[50dvw] max-lg:flex-col-reverse">
//       <Toolbar />
//       {editor.previewMode && (
//         <DeviceFrame previewMode={editor.previewMode}>
//           <Preview previewMode={editor.previewMode} />
//         </DeviceFrame>
//       )}
//       {/* <Settings /> */}
//     </main>
//   );
// }
