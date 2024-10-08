import { useMediaQuery } from "usehooks-ts";
import { useEditor } from "./use-editor-store";
import { useEffect } from "react";

export function useIsMobileDevice() {
  return useMediaQuery("(min-device-width: 320px) and (max-device-width: 480px)");
}

export function useIsTabletDevice() {
  // 1366px is iPad Pro 12.9"
  return useMediaQuery("(min-device-width: 481px) and (max-device-width: 1366px)");
}

export function useIsLargeDevice() {
  return useMediaQuery("(min-device-width: 1367px)");
}

export function usePreviewModeInit() {
  const editor = useEditor();
  const isTablet = useIsTabletDevice();
  const isLargeDevice = useIsLargeDevice();
  const isMobile = useIsMobileDevice();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!editor.previewMode && (isLargeDevice || isTablet || isMobile)) {
      const mode = isLargeDevice ? "desktop" : isTablet ? "tablet" : "mobile";
      console.debug("Initiliazing preview mode to %s", mode);
      editor.setPreviewMode(mode);
    }
  }, []);
}
