// src/components/blocks/image-block.ts
import { EPBlockBase } from "../base/ep-block-base";

class ImageBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "src", "alt", "sources"];
  }

  get src() {
    return (
      this.getAttribute("src") ||
      "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    );
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

  protected get contents() {
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
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-image": ImageBlock;
  }
}
customElements.define("ep-image", ImageBlock);
