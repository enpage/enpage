import { CustomElement } from "./custom-element";

export abstract class EPBlockBase extends CustomElement {
  static baseStyles = ``;

  static get observedAttributes() {
    return ["ep-label"];
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  get blockType(): string {
    return this.getAttribute("ep-block-type") || "";
  }

  toJSON(): Record<string, unknown> {
    const attrs = this.getAttributeNames().reduce(
      (acc, name) => {
        acc[name] = this.getAttribute(name);
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return {
      $tag: this.tagName.toLowerCase(),
      ...attrs,
    };
  }

  protected get contents(): string {
    return "<slot></slot>";
  }
}
