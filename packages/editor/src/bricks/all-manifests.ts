// hero
import { defaults as heroDefaults, type Manifest as HeroManifest, manifest as heroManifest } from "./hero";
// image
import { defaults as imageDefaults, manifest as imageManifest } from "./image";
// video
import { defaults as videoDefaults, manifest as videoManifest } from "./video";
// text
import { defaults as textDefaults, manifest as textManifest } from "./text";
// text-with-title
import { defaults as textWithTitleDefaults, manifest as textWithTitleManifest } from "./text-with-title";

import type { BrickManifest } from "@enpage/sdk/shared/bricks";
import type { Static } from "@sinclair/typebox";

export const manifests: Record<string, BrickManifest> = {
  [heroDefaults.type]: heroManifest,
  [imageDefaults.type]: imageManifest,
  [textDefaults.type]: textManifest,
  [textWithTitleDefaults.type]: textWithTitleManifest,
  [videoDefaults.type]: videoManifest,
};

export const defaults: Record<string, Static<BrickManifest>> = {
  [heroDefaults.type]: heroDefaults,
  [imageDefaults.type]: imageDefaults,
  [textDefaults.type]: textDefaults,
  [textWithTitleDefaults.type]: textWithTitleDefaults,
  [videoDefaults.type]: videoDefaults,
};
