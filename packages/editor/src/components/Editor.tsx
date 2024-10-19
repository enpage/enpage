import { useDraft, useEditor } from "@enpage/sdk/browser/use-editor";
import Toolbar from "./Toolbar";
import { useMemo, useRef, useState, type ComponentProps } from "react";
import Inspector from "./inspector/Inspector";
import { DeviceFrame, Preview } from "./Preview";
import BlocksLibrary from "./blocks-library/BlocksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import { cn } from "../utils/component-utils";
import { Settings } from "./Settings";

import "./Editor.css";

export default function Editor({ className, ...props }: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div
      id="editor"
      className={cn("h-dvh max-h-dvh max-w-[100dvw] overflow-hidden flex relative flex-1", className)}
      {...props}
      ref={rootRef}
    >
      <Inspector />
      <Main />
      <BlocksLibrary />
    </div>
  );
}

function Main() {
  const editor = useEditor();

  // Initialize preview mode depending on the user's editing device
  usePreviewModeInit();

  return (
    <main className="flex flex-col flex-auto max-lg:max-w-[50dvw] max-lg:flex-col-reverse z-auto">
      <Toolbar />
      <section role="application" className="flex-1">
        <div className="grid place-items-center h-full">
          {editor.previewMode && (
            <DeviceFrame previewMode={editor.previewMode}>
              <Preview previewMode={editor.previewMode} />
            </DeviceFrame>
          )}
        </div>
      </section>
      <Settings />
    </main>
  );
}
