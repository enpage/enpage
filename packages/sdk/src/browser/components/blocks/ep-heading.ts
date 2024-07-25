import { TextBlock } from "./ep-text";

type Level = "1" | "2" | "3" | "4" | "5" | "6";

class HeadingBlock extends TextBlock {
  static get observedAttributes() {
    return [...super.observedAttributes, "level"];
  }

  get level() {
    return (this.getAttribute("level") as Level) || "1";
  }

  set level(value: Level) {
    this.setAttribute("level", value);
  }

  protected get contents() {
    return `<h${this.level}>${this.content}</h${this.level}>`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      level: this.level,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-heading": HeadingBlock;
  }
}

customElements.define("ep-heading-block", HeadingBlock);
