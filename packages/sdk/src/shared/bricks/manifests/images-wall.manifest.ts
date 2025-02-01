import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, container, contentAwareProps } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";

export const manifest = defineBrickManifest({
  type: "image-wall",
  kind: "widget",
  title: "Images wall",
  description: "An image collection",
  preferredWidth: {
    mobile: LAYOUT_COLS.mobile / 2,
    desktop: LAYOUT_COLS.desktop / 4,
  },
  preferredHeight: {
    mobile: 6,
    desktop: 6,
  },
  minWidth: {
    mobile: 3,
    desktop: 3,
  },
  minHeight: {
    mobile: 3,
    desktop: 3,
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Image rectangles in masonry layout -->
    <rect x="5" y="5" width="6" height="5" rx="1"></rect>
    <rect x="13" y="5" width="6" height="7" rx="1"></rect>
    <rect x="5" y="12" width="6" height="7" rx="1"></rect>
    <rect x="13" y="14" width="6" height="5" rx="1"></rect>
</svg>
  `,
  props: Type.Composite([contentAwareProps, commonProps, container]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
