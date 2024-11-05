import { useDraft, useDraftStoreContext, useEditor } from "@enpage/sdk/browser/use-editor";
import Toolbar from "./Toolbar";
import Topbar from "./Topbar";
import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import Inspector from "./Inspector";
import { DeviceFrame } from "./Preview";
import BlocksLibrary from "./bricks-library/BricksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import Page from "@enpage/sdk/browser/page";
import { tx, injectGlobal, css } from "@enpage/sdk/browser/twind";
import ThemePanel from "./ThemePanel";
import SettingsPanel from "./SettingsPanel";
import type { PageInfo } from "./types";
import type { GenericPageConfig } from "@enpage/sdk/shared/page-config";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
  pages: PageInfo[];
};

export default function Editor({ mode = "local", pages, ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const draftCtx = useDraftStoreContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    draftCtx.persist.rehydrate();
  }, []);

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    const injected = `
     @layer upstart-theme {
        :root {
          --color-primary: ${themeUsed.colors.primary};
          --color-secondary: ${themeUsed.colors.secondary};
          --color-tertiary: ${themeUsed.colors.tertiary};
          --color-accent: ${themeUsed.colors.accent};
          --color-neutral: ${themeUsed.colors.neutral};
          --color-link: var(--color-primary);
          --font-size-hero-1: clamp(2rem, 9vw, 3.5rem);
          --font-size-hero-2: clamp(3rem, 9vw, 5rem);
          --font-size-hero-3: clamp(4rem, 9vw, 7rem);
          --font-size-hero-4: clamp(5rem, 9vw, 9rem);
          --font-size-hero-5: clamp(6rem, 9vw, 11rem);
        }
        [data-upstart-theme] {
          .page-container {
            font-family: var(--font-${themeUsed.typography.body});
          }
        }
    }
    `;
    injectGlobal(injected);
  }, [draft.previewTheme, draft.theme]);

  usePreviewModeInit();

  return (
    <div
      id="editor"
      className={tx(
        "min-h-[100dvh] max-h-[100dvh] grid relative overscroll-none",
        css({
          gridTemplateAreas: `"topbar topbar" "toolbar main"`,
          gridTemplateRows: "3.7rem 1fr",
          gridTemplateColumns: "3.7rem 1fr",
        }),
      )}
      {...props}
      ref={rootRef}
    >
      <Topbar pages={pages} />
      <Panel />
      <Toolbar />
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <div
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none overflow-auto",
          css({
            gridArea: "main",
          }),
        )}
      >
        <DeviceFrame>
          <Page />
        </DeviceFrame>
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
        `z-[9999] fixed top-[3.7rem] bottom-0 left-[3.7rem] flex shadow-2xl flex-col overscroll-none \
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
      {editor.panel === "settings" && <SettingsPanel />}
    </aside>
  );
}
