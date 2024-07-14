import { CustomElement } from "./custom-element";

export abstract class EPBlockBase extends CustomElement {
  constructor() {
    super();
    if (!this.hasAttribute("ep-type")) {
      throw new Error("ep-type attribute must be set");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  get epType(): string {
    return this.getAttribute("ep-type") || "";
  }

  abstract toJSON(): Record<string, any>;

  protected get template(): string {
    return "<slot></slot>";
  }
}
