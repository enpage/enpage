import { type ComponentProps, useEffect, useRef, useState } from "react";
import styles from "./Preview.module.css";
import { usePreviewMode } from "@enpage/sdk/browser/use-editor";
import { tx } from "@enpage/sdk/browser/twind";

export function DeviceFrame({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const previewMode = usePreviewMode();
  const [show, setShow] = useState<boolean | null>(false);

  useEffect(() => {
    console.log("DeviceFrame previewMode", previewMode);
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 450);
  }, [previewMode]);

  return (
    <div
      ref={ref}
      className={tx(
        "device-frame opacity-20 transition-all duration-200 mx-auto scrollbar-thin",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "tablet" || previewMode === "mobile",
          "!opacity-20": !show,
          "!opacity-100": show,
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
}
