import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@enpage/style-system/twind";
import { commonProps, contentAwareProps } from "./props/common";
import { commonStyleProps } from "./props/style-props";
import { defineBrickManifest } from "@enpage/sdk/shared/bricks";
import { LAYOUT_COLS } from "@enpage/sdk/shared/layout-constants";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "countdown",
  kind: "widget",
  title: "Countdown",
  description: "A countdown timer",
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
    <!-- Main container (centered) -->
    <rect x="2" y="6" width="20" height="12" rx="1" ry="1"></rect>

    <!-- Left digit -->
    <path d="M4 9 L4 15"></path>
    <path d="M4 9 L7 9"></path>
    <path d="M4 12 L7 12"></path>
    <path d="M4 15 L7 15"></path>
    <path d="M7 9 L7 15"></path>

    <!-- Second digit -->
    <path d="M9 9 L9 15"></path>
    <path d="M9 9 L12 9"></path>
    <path d="M9 12 L12 12"></path>
    <path d="M9 15 L12 15"></path>
    <path d="M12 9 L12 15"></path>

    <!-- Colon (tiny) -->
    <circle cx="15" cy="10.5" r="0.15"></circle>
    <circle cx="15" cy="13.5" r="0.15"></circle>

    <!-- Third digit -->
    <path d="M17 9 L17 15"></path>
    <path d="M17 9 L20 9"></path>
    <path d="M17 12 L20 12"></path>
    <path d="M17 15 L20 15"></path>
    <path d="M20 9 L20 15"></path>
</svg>
  `,

  file: filename,
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

const WidgetMap = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content, heroFontSize } = props;

  if (!content.startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  const sizeClass = css({
    "font-size": `var(--${heroFontSize})`,
  });

  return <div>Im a card</div>;
});

export default WidgetMap;
