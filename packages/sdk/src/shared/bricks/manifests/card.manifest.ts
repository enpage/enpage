import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, contentAwareProps } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { color, commonStyleProps } from "../props/style-props";

export const manifest = defineBrickManifest({
  type: "card",
  kind: "widget",
  title: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
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
  // svg icon for the "card" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Card container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Image area separator line -->
    <line x1="3" y1="11" x2="21" y2="11"></line>

    <!-- Title (shorter line) -->
    <line x1="7" y1="14" x2="17" y2="14"></line>

    <!-- Text content (shorter line) -->
    <line x1="7" y1="17" x2="15" y2="17"></line>
</svg>
  `,

  props: Type.Composite([
    commonProps,
    commonStyleProps,
    Type.Object({
      title: Type.Optional(Type.Composite([contentAwareProps, commonProps], { title: "Title" })),
      image: Type.Optional(
        Type.Object(
          {
            image: Type.String({
              title: "Image",
              "ui:field": "file",
              "ui:accept": "image/*",
              "ui:show-img-search": true,
            }),
          },
          { title: "Image" },
        ),
      ),
      body: Type.Optional(
        Type.Union(
          [
            Type.Composite([contentAwareProps, commonProps], {
              title: "Fixed Content",
            }),
            Type.String({
              title: "Data source",
            }),
          ],
          { title: "Body" },
        ),
      ),
      footer: Type.Optional(Type.Composite([contentAwareProps, commonProps], { title: "Footer" })),
    }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
