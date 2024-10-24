import { manifest as heroManifest, defaults as heroDefaults, type Manifest as HeroManifest } from "./hero";
import {
  manifest as imageManifest,
  defaults as imageDefaults,
  type Manifest as ImageManifest,
} from "./image";
import type { BrickManifest } from "./manifest";
import { manifest as textManifest, defaults as textDefaults, type Manifest as TextManifest } from "./text";
import {
  manifest as textWithTitleManifest,
  defaults as textWithTitleDefaults,
  type Manifest as TextWithTitleManifest,
} from "./text-with-title";

// export type GenericBrickManifest = HeroManifest | ImageManifest | TextManifest | TextWithTitleManifest;
export type { HeroManifest, ImageManifest, TextManifest, TextWithTitleManifest };
// export type BrickType = GenericBrickManifest["type"];

export const manifests: Record<string, BrickManifest> = {
  [heroDefaults.type]: heroManifest,
  [imageDefaults.type]: imageManifest,
  [textDefaults.type]: textManifest,
  [textWithTitleDefaults.type]: textWithTitleManifest,
};
