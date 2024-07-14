export abstract class CustomElement extends HTMLElement {
  protected abstract get template(): string;

  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.render();
    }
  }

  protected render() {
    // Create temporary container
    const temp = document.createElement("div");
    temp.innerHTML = this.template;

    // Replace this element's children with the template content
    this.replaceChildren(...temp.childNodes);
  }

  static get observedAttributes(): string[] {
    return [];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.render();
  }
}
