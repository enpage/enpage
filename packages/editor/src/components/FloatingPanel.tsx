import { useEffect, useRef, useState, type ComponentProps } from "react";
import clsx from "clsx";

type FloatingPanelProps = ComponentProps<"aside">;

export function FloatingPanel({ children, className, ...props }: FloatingPanelProps) {
  return (
    <aside
      className={clsx(
        `min-w-[300px] w-[18dvw] max-w-[18dvw] 2xl:max-w-[14dvw] z-10 absolute floating-panel`,
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
