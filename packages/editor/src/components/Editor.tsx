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
import { tx, injectGlobal } from "@enpage/sdk/browser/twind";
import { useLocalStorage } from "usehooks-ts";
import ThemePanel from "./ThemePanel";

export default function Editor({ className, ...props }: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);
  const editor = useEditor();
  const draft = useDraft();
  const [toolbarPos, setToolbarPos] = useLocalStorage<ToolbarProps["position"]>("toolbar-position", "left");

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    const injected = `
     @layer upstart-theme {
      :root {
        --color-primary: ${themeUsed.colors.primary};
        --color-secondary: ${themeUsed.colors.secondary};
        --color-tertiary: ${themeUsed.colors.tertiary};
        --color-gray: ${themeUsed.colors.neutral};
        --color-link: var(--color-primary);
      }
    }
    `;
    injectGlobal(injected);
  }, [draft.previewTheme, draft.theme]);

  usePreviewModeInit();
  return (
    <div
      id="editor"
      className={tx("h-[100dvh] max-h-[100dvh] flex relative flex-1", className)}
      {...props}
      ref={rootRef}
    >
      <Panel />
      <Toolbar position={toolbarPos} />
      {draft.previewTheme && <ThemePreviewConfirmButton />}
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

function ThemePreviewConfirmButton() {
  return <div />;
}

type PanelProps = ComponentProps<"aside">;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const editor = useEditor();
  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-0 bottom-0 left-[3.7rem] flex shadow-2xl lex flex-col \
        min-w-[300px] w-[18dvw] max-w-[18dvw] 2xl:max-w-[14dvw] transition-all duration-200 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-upstart-200 dark:border-dark-700 overflow-auto`,
        {
          "-translate-x-full opacity-0": !editor.panel,
        },
      )}
      {...props}
    >
      {editor.panel === "library" && <BlocksLibrary />}
      {editor.panel === "inspector" && <Inspector />}
      {editor.panel === "theme" && <ThemePanel />}
    </aside>
  );
}
