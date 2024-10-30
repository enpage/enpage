import { clsx } from "../utils/component-utils";
import { type ComponentProps, memo, useEffect, useMemo, useRef, useState } from "react";
import type { ResponsiveMode } from "@enpage/sdk/responsive";
import styles from "./Preview.module.css";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

type PreviewIframeProps = {
  previewMode: ResponsiveMode;
};

export function DeviceFrame({
  children,
  previewMode,
  ...props
}: ComponentProps<"div"> & Pick<PreviewIframeProps, "previewMode">) {
  const ref = useRef<HTMLDivElement>(null);
  const [showContents, setShowContents] = useState(true);

  useResizeObserver({
    ref,
    onResize: () => setShowContents(false),
  });

  useEffect(() => {
    const itv = setInterval(() => {
      if (!showContents) {
        setShowContents(true);
        clearInterval(itv);
      }
    }, 200);
    return () => itv && clearInterval(itv);
  }, [showContents]);

  return (
    <div
      ref={ref}
      className={clsx(
        "device-frame transition-all duration-75 mx-auto scrollbar-thin ",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "tablet" || previewMode === "mobile",
        },
      )}
      {...props}
    >
      {showContents && children}
    </div>
  );
}
