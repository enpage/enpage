import { useDraft, useEditor } from "../hooks/use-editor-store";
import Toolbar from "./Toolbar";
import { useMemo, useRef, useState, type ComponentProps } from "react";
import Inspector from "./inspector/Inspector";
import { DeviceFrame, PreviewIframe } from "./Iframe";
import BlocksLibrary from "./blocks-library/BlocksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import { cn } from "../utils/component-utils";
import { Settings } from "./Settings";

import "./Editor.css";
import { isSafari } from "../utils/is-safari";

export type EditorProps = ComponentProps<"div">;

export default function Editor({ className, ...props }: EditorProps) {
  // const editor = useEditor();
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="editor"
      className={cn(
        // bg-gray-300 dark:bg-dark-900
        "h-dvh max-h-dvh max-w-[100dvw] overflow-hidden flex relative flex-1",
        className,
      )}
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
  const draft = useDraft();
  const [html] = useState(draft.html);

  // Store html in a state, we don't want to rerender the iframe on every change
  // because the source of truth is the iframe dom itself
  const iframeProps = useMemo(() => {
    return {
      html,
      url: editor.templateUrl,
      previewMode: editor.previewMode,
    };
  }, [html, editor.previewMode, editor.templateUrl]);

  // Initialize preview mode depending on the user's editing device
  usePreviewModeInit();

  return (
    <main className="flex flex-col flex-auto max-lg:max-w-[50dvw] max-lg:flex-col-reverse z-auto">
      <section role="toolbar" className="lg:py-8 lg:absolute lg:z-50 lg:left-1/2 lg:-translate-x-1/2">
        <Toolbar />
      </section>
      <section role="application" className="flex-1">
        <div className="grid place-items-center h-full">
          {(iframeProps.html || iframeProps.url) && iframeProps.previewMode && (
            <DeviceFrame previewMode={iframeProps.previewMode}>
              <PreviewIframe
                url={iframeProps.url}
                html={iframeProps.html}
                previewMode={iframeProps.previewMode}
              />
              {/* TODO: identify why/when it is needed */}
              {isSafari() && (
                <div id="frame-over-buster" className="absolute inset-0 z-50 pointer-events-auto" />
              )}
            </DeviceFrame>
          )}
        </div>
      </section>
      <Settings />
    </main>
  );
}
