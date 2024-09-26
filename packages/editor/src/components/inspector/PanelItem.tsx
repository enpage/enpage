import type { ElementSelectedPayload } from "@enpage/sdk/browser/types";
import type { ComponentProps } from "react";

export type PanelItemProps = ComponentProps<"div"> & {
  element: ElementSelectedPayload["element"];
  title: string;
};

export function PanelItem({ children, ...props }: PanelItemProps) {
  return (
    <div className="p-2" {...props}>
      <h3 className="text-lg font-semibold">{props.title}</h3>
      {children}
    </div>
  );
}
