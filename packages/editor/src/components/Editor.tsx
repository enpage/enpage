import { useEditor } from "../hooks/use-editor-store";
import Toolbar from "./Toolbar";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import Inspector from "./inspector/Inspector";
import { DeviceFrame, PreviewIframe } from "./Iframe";
import BlocksLibrary from "./blocks-library/BlocksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";

export default function Editor() {
  // const editor = useEditor();
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="editor"
      className="h-dvh max-h-dvh overflow-hidden flex relative flex-1 bg-gray-300 dark:bg-gray-700 touch-none"
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
  usePreviewModeInit();

  return (
    <main className="flex flex-col flex-1 max-lg:flex-col-reverse">
      <section role="toolbar" className="xl:py-8">
        <Toolbar />
      </section>
      <section role="application" className="flex-1 xl:px-4">
        <div className="grid place-items-center h-full">
          {(editor.html || editor.templateUrl) && editor.previewMode && (
            <DeviceFrame previewMode={editor.previewMode}>
              <PreviewIframe url={editor.templateUrl} html={editor.html} previewMode={editor.previewMode} />
              {/* hack */}
              <div id="frame-over-buster" className="absolute inset-0 z-50 pointer-events-auto" />
            </DeviceFrame>
          )}
        </div>
      </section>
    </main>
  );
}
