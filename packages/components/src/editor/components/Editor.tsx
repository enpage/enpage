import {
  useDraft,
  useEditor,
  useAttributes,
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
import { Button } from "@upstart.gg/style-system/system";
import { isStandardColor, generateColorsVars } from "@upstart.gg/sdk/shared/themes/color-system";
import { usePageAutoSave, useOnDraftChange } from "~/editor/hooks/use-page-autosave";
import DataPanel from "./PanelData";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
  onDraftChange?: (state: DraftState, pageInfo: ReturnType<typeof usePageInfo>) => void;
};

const PanelTheme = lazy(() => import("./PanelTheme"));
const SettingsPanel = lazy(() => import("./PanelSettings"));
const PanelInspector = lazy(() => import("./PanelInspector"));
const PanelLibrary = lazy(() => import("./PanelLibrary"));

export default function Editor({ mode = "local", onDraftChange, ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const attributes = useAttributes();

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
        [data-upstart-theme] {
          .page-container {
            font-family: var(--font-${themeUsed.typography.body});
          }
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
          gridTemplateAreas: `"topbar topbar" "toolbar main"`,
          gridTemplateRows: "3.7rem 1fr",
          gridTemplateColumns: "3.7rem 1fr",
        }),
      )}
      {...props}
      ref={rootRef}
    >
      <Topbar />
      <Panel />
      <Toolbar />
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <div
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none overflow-x-auto overflow-y-visible transition-colors duration-300",
          css({
            gridArea: "main",
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            "&:hover": {
              scrollbarColor: "var(--violet-7) var(--violet-3)",
            },
          }),
          previewMode === "mobile" && "bg-gray-300",
          previewMode === "desktop" &&
            isStandardColor(attributes.$backgroundColor) &&
            css({ backgroundColor: attributes.$backgroundColor as string }),
          previewMode === "desktop" &&
            isStandardColor(attributes.$textColor) &&
            css({ color: attributes.$textColor as string }),
          previewMode === "desktop" &&
            !isStandardColor(attributes.$backgroundColor) &&
            (attributes.$backgroundColor as string),
          previewMode === "desktop" &&
            !isStandardColor(attributes.$textColor) &&
            (attributes.$textColor as string),
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
  const editor = useEditor();

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-[3.7rem] bottom-0 left-[3.7rem] flex shadow-2xl flex-col overscroll-none \
        min-w-[300px] w-[350px] transition-all duration-200 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-upstart-200 dark:border-dark-700 overflow-auto`,
        {
          "-translate-x-full opacity-0": !editor.panel,
        },
      )}
      {...props}
    >
      {editor.previewMode === "desktop" && editor.panel === "library" && (
        <Suspense>
          <PanelLibrary />
        </Suspense>
      )}
      {editor.panel === "inspector" && (
        <Suspense>
          <PanelInspector />
        </Suspense>
      )}
      {editor.panel === "theme" && (
        <Suspense>
          <PanelTheme />
        </Suspense>
      )}
      {editor.panel === "settings" && (
        <Suspense>
          <SettingsPanel />
        </Suspense>
      )}
      {editor.panel === "data" && (
        <Suspense>
          <DataPanel />
        </Suspense>
      )}
      {/* {editor.modal === "image-search" && <ModalSearchImage />} */}
    </aside>
  );
}
