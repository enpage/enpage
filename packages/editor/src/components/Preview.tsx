import { clsx } from "../utils/component-utils";
import { type ComponentProps, memo, useEffect, useMemo, useRef, useState } from "react";
import type { ResponsiveMode } from "@enpage/sdk/responsive";
import styles from "./Preview.module.css";
import Page from "@enpage/sdk/browser/page";

type PreviewIframeProps = {
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
        "device-frame relative transition-[width,height] duration-300 mx-auto flex scrollbar-thin",
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
export function Preview({ previewMode }: PreviewIframeProps) {
  return (
    <div
      className={clsx("flex-1 h-full relative pointer-events-auto", {
        "rounded-none": previewMode === "desktop",
        "rounded-[inherit]": previewMode !== "desktop",
      })}
      id="preview"
      title="Site Preview"
    >
      <Page />
    </div>
  );
}
