import { clsx } from "../utils/component-utils";
import { type ComponentProps, useRef } from "react";
import type { ResponsiveMode } from "@enpage/sdk/responsive";
import styles from "./Iframe.module.css";
import { useIframeMessaging, useDragOverIframe } from "../hooks/use-iframe";

type PreviewIframeProps = {
  html?: string;
  url?: string;
  previewMode: ResponsiveMode;
};

export function DeviceFrame({
  children,
  previewMode,
  ...props
}: ComponentProps<"div"> & Pick<PreviewIframeProps, "previewMode">) {
  return (
    <div
      className={clsx(
        // relatively positioned because on safari we'll have a iframe-overlay
        "device-frame relative transition-all duration-500 mx-auto flex scrollbar-thin",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "tablet" || previewMode === "mobile",
          "flex-col justify-start": previewMode === "desktop",
        },
      )}
      {...props}
    >
      {/* {previewMode === "desktop" && <div className={styles.desktopBar} data-url="https://john.enpage.co" />} */}
      {children}
    </div>
  );
}

// create a PreviewIframe and forward ref
export function PreviewIframe({ html, url, previewMode }: PreviewIframeProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  useIframeMessaging(ref);
  useDragOverIframe(ref);

  return (
    <iframe
      ref={ref}
      className={clsx("flex-1 h-full relative pointer-events-auto", {
        "rounded-none": previewMode === "desktop",
        "rounded-[inherit]": previewMode !== "desktop",
      })}
      id="preview"
      name="preview"
      title="Site Preview"
      srcDoc={html}
      src={url}
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
    />
  );
}
