import type { BrickManifest } from "~/shared/brick-manifest";

export type BrickProps<Manifest extends BrickManifest> = Manifest["props"] & {
  $mobileProps: Manifest["mobileProps"];
};
