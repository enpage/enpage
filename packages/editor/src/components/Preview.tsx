import { type ComponentProps, useEffect, useRef, useState } from "react";
import styles from "./Preview.module.css";
import { usePreviewMode } from "~/hooks/use-editor";
import { tx } from "@enpage/style-system/twind";

export function DeviceFrame({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const previewMode = usePreviewMode();
  const [show, setShow] = useState<boolean | null>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 450);
  }, [previewMode]);

  return (
    <div
      ref={ref}
      className={tx(
        "device-frame opacity-20 transition-all duration-200 mx-auto scrollbar-thin @container",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "mobile",
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
