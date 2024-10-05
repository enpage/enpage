import { EPBlockBase, registerElement } from "../base/ep-block-base";
import { Type, type Static, type TObject } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { defineBlockManifest } from "../base/ep-block-base";
import { parse } from "marked";
import DOMPurify from "dompurify";
import html from "~/shared/html-template-tag";

export class TextBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "content", "mode"];
  }

  static get manifest() {
    return manifest;
  }

  get content() {
    return this.innerText || defaults.props.content;
  }

  set content(value: string) {
    this.innerText = value;
  }

  get format() {
    return (this.getAttribute("format") || "plain") as Manifest["props"]["format"];
  }

  set mode(value: Manifest["props"]["format"]) {
    this.setAttribute("format", value);
  }

  render() {
    const temp = window.document.createElement("div");

    // for markdown, we should save the content in a template element
    if (this.format === "markdown") {
      const template = document.createElement("template");
      template.innerText = this.content;

      const fragment = document.createDocumentFragment();
      fragment.appendChild(template);

      temp.innerHTML = this.contents;
      this.replaceChildren(fragment, ...temp.childNodes);
    } else {
      temp[this.format === "html" ? "innerHTML" : "innerText"] = this.contents;
      this.replaceChildren(...temp.childNodes);
    }

    return this.outerHTML;
  }

  protected get contents() {
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters
    const cleanContent = this.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

    if (this.format === "html") {
      return DOMPurify.sanitize(cleanContent);
    } else if (this.format === "markdown") {
      return DOMPurify.sanitize(
        parse(cleanContent, {
          async: false,
          breaks: true,
        }),
      );
    }
    return this.content;
  }
}

export const manifest = defineBlockManifest({
  type: "ep-text",
  title: "Text",
  description: "A text block",
  icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>`,
  template: html`<ep-text ep-label="Text" ep-text-editable="html" ep-editable>My text</ep-text>`,
  props: Type.Object({
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
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

declare global {
  interface HTMLElementTagNameMap {
    "ep-text": TextBlock;
  }
}

export function register() {
  registerElement(TextBlock, defaults);
}

register();
