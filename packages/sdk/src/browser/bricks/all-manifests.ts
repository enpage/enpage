// hero
import { defaults as heroDefaults, type Manifest as HeroManifest, manifest as heroManifest } from "./hero";

// image
import {
  defaults as imageDefaults,
  type Manifest as ImageManifest,
  manifest as imageManifest,
} from "./image";

// video
import {
  defaults as videoDefaults,
  type Manifest as VideoManifest,
  manifest as videoManifest,
} from "./video";

// text
import { defaults as textDefaults, type Manifest as TextManifest, manifest as textManifest } from "./text";

// text-with-title
import {
  defaults as textWithTitleDefaults,
  type Manifest as TextWithTitleManifest,
  manifest as textWithTitleManifest,
} from "./text-with-title";

import type { BrickManifest } from "./manifest";
// export type { HeroManifest, ImageManifest, TextManifest, TextWithTitleManifest };

// export type BrickManifest = HeroManifest | ImageManifest | TextManifest | TextWithTitleManifest;
export type BrickType = (
  | HeroManifest
  | ImageManifest
  | TextManifest
  | TextWithTitleManifest
  | VideoManifest
)["type"];

export const manifests: Record<BrickType, BrickManifest> = {
  [heroDefaults.type]: heroManifest,
  [imageDefaults.type]: imageManifest,
  [textDefaults.type]: textManifest,
  [textWithTitleDefaults.type]: textWithTitleManifest,
  [videoDefaults.type]: videoManifest,
};
