import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, contentAwareProps } from "../props/common";
import { commonStyleProps } from "../props/style-props";
import { defineBrickManifest } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS } from "@upstart.gg/sdk/shared/layout-constants";

// get filename from esm import.meta
export const manifest = defineBrickManifest({
  type: "button",
  title: "Button",
  kind: "brick",
  description: "A button with text and optional icon",
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
  icon: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->

    <!-- Button container -->
    <rect x="4" y="11" width="16" height="6" rx="2"></rect>

    <!-- Text line inside button -->
    <line x1="9" y1="14" x2="15" y2="14"></line>
</svg>
  `,
  props: Type.Composite([
    contentAwareProps,
    commonProps,
    commonStyleProps,
    Type.Object({
      heroFontSize: Type.Union(
        [
          Type.Literal("font-size-hero-1", { title: "1" }),
          Type.Literal("font-size-hero-2", { title: "2" }),
          Type.Literal("font-size-hero-3", { title: "3" }),
          Type.Literal("font-size-hero-4", { title: "4" }),
          Type.Literal("font-size-hero-5", { title: "5" }),
        ],
        {
          default: "font-size-hero-3",
          title: "Font size",
          "ui:field": "enum",
          "ui:display": "button-group",
          "ui:group": "border",
        },
      ),
    }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
