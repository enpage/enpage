import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { parse } from "marked";
import DOMPurify from "dompurify";
import { tx } from "@twind/core";
import { getCommonBrickProps } from "./common";
import { forwardRef } from "react";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text-with-title",
  title: "Title & Text",
  description: "A textual brick with a title",
  icon: "text-title",
  file: filename,
  props: Type.Object({
    title: Type.String({
      default: "Click to edit",
      title: "Content",
      description: "The text content",
      "ep:prop-type": "content",
    }),
    content: Type.String({
      default: "Click to edit",
      title: "Content",
      description: "The text content",
      "ep:prop-type": "content",
    }),
    format: Type.Union(
      [
        Type.Literal("plain", { title: "Plain", description: "Plain text mode" }),
        Type.Literal("html", { title: "HTML", description: "HTML mode" }),
        Type.Literal("markdown", { title: "Markdown", description: "Markdown mode" }),
      ],
      {
        default: "html",
        title: "Format",
        description: "The text format",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    titleClassName: Type.String({
      default: "text-lg font-bold",
      title: "Title Class Name",
      description: "The class name to apply to the title",
      "ui:field": "hidden",
    }),
    titleLevel: Type.Union(
      [
        Type.Literal("h1", { title: "h1", description: "Title" }),
        Type.Literal("h2", { title: "h2", description: "Subtitle" }),
        Type.Literal("h3", { title: "h3", description: "Heading level 3" }),
        Type.Literal("h4", { title: "h4", description: "Heading level 4" }),
        Type.Literal("h5", { title: "h5", description: "Heading level 5" }),
        Type.Literal("h6", { title: "h6", description: "Heading level 6" }),
      ],
      {
        default: "h2",
        title: "Title Level",
        description: "The title level",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    ...getCommonBrickProps("p-4"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const TextWithTitle = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { format, title, content, className, titleClassName, titleLevel, ...attrs } = props;

  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const TitleTag = titleLevel as keyof JSX.IntrinsicElements;

  if (format === "html") {
    return (
      <div ref={ref} className={tx(className)} {...attrs}>
        <TitleTag className={tx(titleClassName)}>{title}</TitleTag>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content */}
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      </div>
    );
  } else if (format === "markdown") {
    return (
      <div ref={ref} className={tx(className)} {...attrs}>
        <TitleTag className={tx(titleClassName)}>{title}</TitleTag>
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              parse(content, {
                async: false,
                breaks: true,
              }),
            ),
          }}
        />
      </div>
    );
  } else {
    return (
      <div ref={ref} className={tx(className)} {...attrs}>
        <TitleTag className={tx(titleClassName)}>twt title: {title}</TitleTag>
        <div>twt content: {content}</div>
      </div>
    );
  }
});

export default TextWithTitle;
