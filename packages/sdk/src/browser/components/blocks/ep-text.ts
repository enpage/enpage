import { EPBlockBase } from "../base/ep-block-base";

type Mode = "plain" | "html" | "markdown";

export class TextBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "content", "mode"];
  }

  get content() {
    return this.getAttribute("content") || "Click to edit";
  }

  set content(value: string) {
    this.setAttribute("content", value);
  }

  get mode() {
    return (this.getAttribute("mode") as Mode) || "plain";
  }

  set mode(value: Mode) {
    this.setAttribute("mode", value);
  }

  protected get contents() {
    // For now, we'll just render the content as-is
    // In the future, we'll handle HTML and Markdown rendering here
    return `<div>${this.content}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-text": TextBlock;
  }
}

customElements.define("ep-text", TextBlock);
