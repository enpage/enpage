import { CustomElement } from "./custom-element";

export abstract class EPBlockBase extends CustomElement {
  static baseStyles = ``;

  constructor() {
    super();
    this.setAttribute("ep-block-type", this.tagName.toLowerCase());
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  get blockType(): string {
    return this.getAttribute("ep-block-type") || "";
  }

  abstract toJSON(): Record<string, unknown>;

  protected get contents(): string {
    return "<slot></slot>";
  }
}
