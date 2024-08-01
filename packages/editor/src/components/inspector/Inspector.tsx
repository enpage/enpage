import { useCallback } from "react";
import { useEditor } from "../../hooks/use-editor-store";
import { BsArrowBarLeft } from "react-icons/bs";
import type { ElementSelectedPayload } from "@enpage/sdk/browser/dev-client";
import { PanelItemSiteBackground } from "./PanelItemSiteBackground";
import { HorizontalDrawer } from "../Drawer";
import { clsx } from "../../utils/component-utils";
import { useIsLargeDevice } from "../../hooks/use-is-device-type";

function Inspector() {
  const editor = useEditor();
  return (
    <div
      className={clsx("bg-white dark:bg-gray-800/50 min-w-[300px] w-[18dvw] max-w-[360px] flex-1 z-50", {
        "opacity-0": !editor.selectedElement,
      })}
    >
      <div className="flex justify-between bg-enpage-600 pr-0">
        <h1 className="p-2 font-medium capitalize text-white/90 flex-1">
          {editor.selectedElement?.attributes["ep-label"]}
        </h1>
        <button
          type="button"
          className="justify-self-end self-stretch p-2 hover:text-white aspect-square text-white/90 md:hidden"
          onClick={() => editor.setSelectedElement()}
        >
          <BsArrowBarLeft className="w-auto" size={22} />
        </button>
      </div>
      {editor.selectedElement && getPanelItemsForElement(editor.selectedElement)}
    </div>
  );
}

export default function InspectorWrapper() {
  const editor = useEditor();
  const isDesktop = useIsLargeDevice();

  const onClosed = useCallback(() => {
    editor.setSelectedElement();
  }, [editor]);

  if (!isDesktop) {
    return (
      <HorizontalDrawer open={!!editor.selectedElement} from="left" noBackdrop onClosed={onClosed}>
        <Inspector />
      </HorizontalDrawer>
    );
  }
  return <Inspector />;
}

function getPanelItemsForElement(element: ElementSelectedPayload["element"]) {
  if (element.attributes["ep-block-type"] === "site-background") {
    return <PanelItemSiteBackground element={element} />;
  }
  return null;
}
