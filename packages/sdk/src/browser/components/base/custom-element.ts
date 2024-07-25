import { nanoid } from "nanoid";

export abstract class CustomElement extends HTMLElement {
  protected abstract get contents(): string;

  connectedCallback() {
    // if element has no ID, generate one
    if (!this.getAttribute("id")) {
      this.setAttribute("id", nanoid(7));
    }
    if (!this.hasChildNodes()) {
      console.log("render from upper connected callback");
      this.render();
    }
  }

  protected render() {
    // Create temporary container
    const temp = document.createElement("div");
    temp.innerHTML = this.contents;

    console.log("rendering", this.constructor.name);

    // Replace this element's children with the template content
    this.replaceChildren(...temp.childNodes);
  }

  static get observedAttributes(): string[] {
    return [];
  }
}
