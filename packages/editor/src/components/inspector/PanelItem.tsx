import type { Brick } from "@enpage/sdk/shared/bricks";
import type { GenericBrickManifest } from "@enpage/sdk/browser/bricks/manifests";
import type { ComponentProps } from "react";

export type PanelItemProps = ComponentProps<"div"> & {
  brick: Brick;
  manifest: GenericBrickManifest;
};

export function PanelItem({ children, manifest, ...props }: PanelItemProps) {
  return (
    <div className="p-2" {...props}>
      <h3 className="text-lg font-semibold">{manifest.title}</h3>
      {children}
    </div>
  );
}
