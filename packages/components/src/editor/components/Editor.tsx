import {
  useDraft,
  useEditor,
  usePanel,
  usePreviewMode,
  type DraftState,
  type usePageInfo,
} from "../hooks/use-editor";
import Toolbar from "./Toolbar";
import Topbar from "./Topbar";
import { lazy, Suspense, useEffect, useRef, type ComponentProps } from "react";
import { DeviceFrame } from "./Preview";
import EditablePage from "./EditablePage";
import { tx, injectGlobal, css } from "@upstart.gg/style-system/twind";
import { Button, Spinner } from "@upstart.gg/style-system/system";
import { generateColorsVars } from "@upstart.gg/sdk/shared/themes/color-system";
import { usePageAutoSave, useOnDraftChange } from "~/editor/hooks/use-page-autosave";
import DataPanel from "./PanelData";
import PanelSettings from "./PanelSettings";
import PanelTheme from "./PanelTheme";
import PanelInspector from "./PanelInspector";
import PanelLibrary from "./PanelLibrary";
import Tour from "./Tour";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
  onDraftChange?: (state: DraftState, pageInfo: ReturnType<typeof usePageInfo>) => void;
};

// const PanelTheme = lazy(() => import("./PanelTheme"));
// const PanelSettings = lazy(() => import("./PanelSettings"));
// const PanelInspector = lazy(() => import("./PanelInspector"));
// const PanelLibrary = lazy(() => import("./PanelLibrary"));

function PanelSpinner() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner size="3" />
    </div>
  );
}

export default function Editor({ mode = "local", onDraftChange, ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const { panel, panelPosition } = usePanel();

  usePageAutoSave();
  useOnDraftChange(onDraftChange);

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    const shades = generateColorsVars(themeUsed);

    const injected = `
     @layer upstart-theme {
        :root {
          ${Object.entries(shades)
            .map(([key, value]) => `--${key}: ${value};`)
            .join("\n")}

          --color-link: var(--color-primary);
          --font-size-hero-1: clamp(2rem, 9vw, 3.5rem);
          --font-size-hero-2: clamp(3rem, 9vw, 5rem);
          --font-size-hero-3: clamp(4rem, 9vw, 7rem);
          --font-size-hero-4: clamp(5rem, 9vw, 9rem);
          --font-size-hero-5: clamp(6rem, 9vw, 11rem);
        }
    }
    `;

    injectGlobal(injected);
  }, [draft.previewTheme, draft.theme]);

  return (
    <div
      id="editor"
      className={tx(
        "min-h-[100dvh] max-h-[100dvh] grid relative overscroll-none overflow-hidden",
        css({
          gridTemplateAreas:
            panelPosition === "left" ? `"topbar topbar" "toolbar main"` : `"topbar topbar" "main toolbar"`,
          gridTemplateRows: "3.7rem 1fr",
          // gridTemplateColumns: "3.7rem 1fr",
          gridTemplateColumns: panelPosition === "left" ? "3.7rem 1fr" : "1fr 3.7rem",
        }),
      )}
      {...props}
      ref={rootRef}
    >
      <Tour />
      <Topbar />
      <Panel />
      <Toolbar />
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <div
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none overflow-x-auto overflow-y-visible transition-colors duration-300",
          previewMode === "mobile" && "bg-gray-300",
          css({
            gridArea: "main",
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollBehavior: "smooth",
            scrollbarGutter: "stable",
            scrollbarWidth: panelPosition === "left" ? "thin" : "none",
            "&:hover": {
              scrollbarColor: "var(--violet-7) var(--violet-3)",
            },
          }),
        )}
      >
        <DeviceFrame>
          <EditablePage />
        </DeviceFrame>
      </div>
    </div>
  );
}

function ThemePreviewConfirmButton() {
  return <Button>Accept theme</Button>;
}

type PanelProps = ComponentProps<"aside">;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const { panel, panelPosition } = usePanel();
  const previewMode = usePreviewMode();

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-[3.7rem] bottom-0 flex shadow-2xl flex-col overscroll-none \
        min-w-[300px] w-[320px] transition-all duration-200 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-upstart-200 dark:border-dark-700 overflow-visible`,
        {
          "left-[3.7rem]": panelPosition === "left",
          "right-[3.7rem]": panelPosition === "right",
          "-translate-x-full opacity-0": !panel && panelPosition === "left",
          "translate-x-full": !panel && panelPosition === "right",
        },
      )}
      {...props}
    >
      {previewMode === "desktop" && panel === "library" && <PanelLibrary />}
      {panel === "inspector" && <PanelInspector />}
      {panel === "theme" && <PanelTheme />}
      {panel === "settings" && <PanelSettings />}
      {panel === "data" && <DataPanel />}
    </aside>
  );
}
