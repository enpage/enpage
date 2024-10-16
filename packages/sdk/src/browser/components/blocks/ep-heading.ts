import { Value } from "@sinclair/typebox/value";
import { defineBlockManifest, EPBlockBase, registerElement } from "../base/ep-block-base";
import { Type, type Static, type TObject } from "@sinclair/typebox";

export class HeadingBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "level"];
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

  get level() {
    const level = parseInt(this.getAttribute("level") ?? "1");
    return Number.isNaN(level) || level < 1 || level > 6 ? 1 : level;
  }

  set level(value: number) {
    this.setAttribute("level", value.toString());
  }

  render() {
    const el = document.createElement(`h${this.level}`);
    el.textContent = this.content;

    this.replaceChildren(el);

    return el.outerHTML;
  }
}

export const manifest = defineBlockManifest({
  type: "ep-heading",
  title: "Heading",
  description: "A heading block",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 6v12M16 6v12M8 12h8"></path>
  </svg>`,
  template:
    '<ep-heading ep-editable ep-text-editable="plain" ep-label="Heading">Click to edit this heading</ep-heading>',
  props: Type.Object({
    level: Type.Union(
      [
        Type.Literal("h1", { title: "h1", description: "Title" }),
        Type.Literal("h2", { title: "h2", description: "Subtitle" }),
        Type.Literal("h3", { title: "h3", description: "Heading level 3" }),
        Type.Literal("h4", { title: "h4", description: "Heading level 4" }),
        Type.Literal("h5", { title: "h5", description: "Heading level 5" }),
        Type.Literal("h6", { title: "h6", description: "Heading level 6" }),
      ],
      {
        default: "h1",
        title: "Level",
        description: "The heading level",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    // format: Type.Union(
    //   [
    //     Type.Literal("html", { title: "HTML", description: "HTML format" }),
    //     Type.Literal("plain", { title: "Plain", description: "Plain text format" }),
    //     Type.Literal("markdown", { title: "Markdown", description: "Markdown format" }),
    //   ],
    //   { default: "plain", "ui:field": "enum", title: "Format", description: "The heading format" },
    // ),
    content: Type.String({ default: "My heading", title: "Content", "ep:prop-type": "content" }),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

declare global {
  interface HTMLElementTagNameMap {
    "ep-heading": HeadingBlock;
  }
}

export function register() {
  registerElement(HeadingBlock, defaults);
}

register();
