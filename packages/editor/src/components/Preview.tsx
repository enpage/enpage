import { clsx } from "../utils/component-utils";
import { type ComponentProps, memo, useEffect, useMemo, useRef, useState } from "react";
import type { ResponsiveMode } from "@enpage/sdk/responsive";
import styles from "./Preview.module.css";

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
        "device-frame transition-all duration-300 mx-auto scrollbar-thin",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "tablet" || previewMode === "mobile",
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
}
