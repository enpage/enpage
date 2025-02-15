import { type ComponentProps, useEffect, useRef, useState } from "react";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import styles from "./Preview.module.css";

export function DeviceFrame({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const previewMode = usePreviewMode();
  const [show, setShow] = useState<boolean | null>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 300);
  }, [previewMode]);

  return (
    <div
      ref={ref}
      className={tx(
        "device-frame opacity-20 transition-all duration-200 mx-auto @container overscroll-contain",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "mobile",
          "!opacity-90": !show,
          "!opacity-100": show,
        },
        css({
          scrollbarColor: "var(--violet-4) var(--violet-2)",
          scrollBehavior: "smooth",
          scrollbarWidth: previewMode === "desktop" ? "thin" : "none",
          "&:hover": {
            scrollbarColor: "var(--violet-7) var(--violet-3)",
          },
        }),
      )}
      {...props}
    >
      {children}
    </div>
  );
}
