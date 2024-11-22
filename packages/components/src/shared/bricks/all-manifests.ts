// hero
import { defaults as heroDefaults, manifest as heroManifest } from "./hero";
// image
import { defaults as imageDefaults, manifest as imageManifest } from "./image";
// video
import { defaults as videoDefaults, manifest as videoManifest } from "./video";
// text
import { defaults as textDefaults, manifest as textManifest } from "./text";
// widget card
import { defaults as cardDefaults, manifest as cardManifest } from "./widget-card";
// widget map
import { defaults as mapDefaults, manifest as mapManifest } from "./widget-map";
// widget form
import { defaults as formDefaults, manifest as formManifest } from "./widget-form";
// widget images-wall
import { defaults as imagesWallDefaults, manifest as imagesWallManifest } from "./widget-images-wall";
// widget carousel
import { defaults as carouselDefaults, manifest as carouselManifest } from "./widget-carousel";
// widget header
import { defaults as headerDefaults, manifest as headerManifest } from "./widget-header";
// widget footer
import { defaults as footerDefaults, manifest as footerManifest } from "./widget-footer";
// button
import { defaults as buttonDefaults, manifest as buttonManifest } from "./button";
// icon
import { defaults as iconDefaults, manifest as iconManifest } from "./icon";
// widget "social-links"
import { defaults as socialLinksDefaults, manifest as socialLinksManifest } from "./widget-social-links";
// widget countdown
import { defaults as countdownDefaults, manifest as countdownManifest } from "./widget-countdown";

import type { BrickManifest } from "@enpage/sdk/shared/bricks";
import type { Static } from "@sinclair/typebox";

export const manifests: Record<string, BrickManifest> = {
  [heroDefaults.type]: heroManifest,
  [imageDefaults.type]: imageManifest,
  [textDefaults.type]: textManifest,
  [videoDefaults.type]: videoManifest,
  [cardDefaults.type]: cardManifest,
  [mapDefaults.type]: mapManifest,
  [formDefaults.type]: formManifest,
  [imagesWallDefaults.type]: imagesWallManifest,
  [carouselDefaults.type]: carouselManifest,
  [headerDefaults.type]: headerManifest,
  [footerDefaults.type]: footerManifest,
  [buttonDefaults.type]: buttonManifest,
  [iconDefaults.type]: iconManifest,
  [socialLinksDefaults.type]: socialLinksManifest,
  [countdownDefaults.type]: countdownManifest,
};

export const defaults: Record<string, Static<BrickManifest>> = {
  [heroDefaults.type]: heroDefaults,
  [imageDefaults.type]: imageDefaults,
  [textDefaults.type]: textDefaults,
  [videoDefaults.type]: videoDefaults,
  [cardDefaults.type]: cardDefaults,
  [mapDefaults.type]: mapDefaults,
  [formDefaults.type]: formDefaults,
  [imagesWallDefaults.type]: imagesWallDefaults,
  [carouselDefaults.type]: carouselDefaults,
  [headerDefaults.type]: headerDefaults,
  [footerDefaults.type]: footerDefaults,
  [buttonDefaults.type]: buttonDefaults,
  [iconDefaults.type]: iconDefaults,
  [socialLinksDefaults.type]: socialLinksDefaults,
  [countdownDefaults.type]: countdownDefaults,
};
