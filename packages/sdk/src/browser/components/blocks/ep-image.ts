// src/components/blocks/image-block.ts
import { EPBlockBase } from "../base/ep-block-base";

class ImageBlock extends EPBlockBase {
  static get observedAttributes() {
    return ["src", "alt", "sources"];
  }

  constructor() {
    super();
    this.setAttribute("ep-type", "image");
  }

  get src() {
    return this.getAttribute("src") || "";
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  get alt() {
    return this.getAttribute("alt") || "";
  }

  set alt(value: string) {
    this.setAttribute("alt", value);
  }

  get sources() {
    try {
      return JSON.parse(this.getAttribute("sources") || "[]");
    } catch {
      return [];
    }
  }

  set sources(value: Array<{ srcset: string; media?: string; type?: string }>) {
    this.setAttribute("sources", JSON.stringify(value));
  }

  protected get template() {
    const sourcesHtml = this.sources
      .map(
        (source) =>
          `<source srcset="${source.srcset}"${source.media ? ` media="${source.media}"` : ""}${source.type ? ` type="${source.type}"` : ""}>`,
      )
      .join("");

    return `
      <picture>
        ${sourcesHtml}
        <img src="${this.src}" alt="${this.alt}">
      </picture>
    `;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.epType,
      src: this.src,
      alt: this.alt,
      sources: this.sources,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-image": ImageBlock;
  }
}

customElements.define("ep-image", ImageBlock);
