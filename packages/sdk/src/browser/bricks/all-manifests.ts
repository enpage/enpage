import { defaults as heroDefaults, type Manifest as HeroManifest, manifest as heroManifest } from "./hero";
import {
  defaults as imageDefaults,
  type Manifest as ImageManifest,
  manifest as imageManifest,
} from "./image";
import type { BrickManifest } from "./manifest";
import { defaults as textDefaults, type Manifest as TextManifest, manifest as textManifest } from "./text";
import {
  defaults as textWithTitleDefaults,
  type Manifest as TextWithTitleManifest,
  manifest as textWithTitleManifest,
} from "./text-with-title";

// export type { HeroManifest, ImageManifest, TextManifest, TextWithTitleManifest };

// export type BrickManifest = HeroManifest | ImageManifest | TextManifest | TextWithTitleManifest;
export type BrickType = (HeroManifest | ImageManifest | TextManifest | TextWithTitleManifest)["type"];

export const manifests: Record<BrickType, BrickManifest> = {
  [heroDefaults.type]: heroManifest,
  [imageDefaults.type]: imageManifest,
  [textDefaults.type]: textManifest,
  [textWithTitleDefaults.type]: textWithTitleManifest,
};
