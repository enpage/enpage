// hero
import { defaults as heroDefaults, manifest as heroManifest } from "./hero.manifest";
// image
import { defaults as imageDefaults, manifest as imageManifest } from "./image.manifest";
// video
import { defaults as videoDefaults, manifest as videoManifest } from "./video.manifest";
// text
import { defaults as textDefaults, manifest as textManifest } from "./text.manifest";
// widget card
import { defaults as cardDefaults, manifest as cardManifest } from "./card.manifest";
// widget map
import { defaults as mapDefaults, manifest as mapManifest } from "./map.manifest";
// widget form
import { defaults as formDefaults, manifest as formManifest } from "./form.manifest";
// widget images-wall
import { defaults as imagesWallDefaults, manifest as imagesWallManifest } from "./images-wall.manifest";
// widget carousel
import { defaults as carouselDefaults, manifest as carouselManifest } from "./carousel.manifest";
// widget header
import { defaults as headerDefaults, manifest as headerManifest } from "./header.manifest";
// widget footer
import { defaults as footerDefaults, manifest as footerManifest } from "./footer.manifest";
// button
import { defaults as buttonDefaults, manifest as buttonManifest } from "./button.manifest";
// icon
import { defaults as iconDefaults, manifest as iconManifest } from "./icon.manifest";
// widget "social-links"
import { defaults as socialLinksDefaults, manifest as socialLinksManifest } from "./social-links.manifest";
// widget countdown
import { defaults as countdownDefaults, manifest as countdownManifest } from "./countdown.manifest";

import type { Static } from "@sinclair/typebox";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";

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
