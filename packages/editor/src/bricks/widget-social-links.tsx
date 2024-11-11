import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@enpage/style-system/twind";
import { commonProps, contentAwareProps } from "./props/common";
import { commonStyleProps } from "./props/style-props";
import { defineBrickManifest } from "@enpage/sdk/shared/bricks";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "social-links",
  kind: "widget",
  title: "Social links",
  description: "A list of social media links",
  preferredW: 12,
  preferredH: 6,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Dots and social info -->
    <circle cx="8" cy="8" r="1" fill="currentColor"></circle>
    <line x1="11" y1="7" x2="16" y2="7"></line>
    <line x1="11" y1="9" x2="13" y2="9" stroke-width="0.5"></line>

    <circle cx="8" cy="12" r="1" fill="currentColor"></circle>
    <line x1="11" y1="11" x2="16" y2="11"></line>
    <line x1="11" y1="13" x2="13.5" y2="13" stroke-width="0.5"></line>

    <circle cx="8" cy="16" r="1" fill="currentColor"></circle>
    <line x1="11" y1="15" x2="16" y2="15"></line>
    <line x1="11" y1="17" x2="13" y2="17" stroke-width="0.5"></line>
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

const SocialLinks = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
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

export default SocialLinks;
