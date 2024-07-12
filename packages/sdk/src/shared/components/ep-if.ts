import { HybridComponent } from "./hybrid-component";
import { isBrowser } from "./utils/is-browser";

class EPIf extends HybridComponent {
  static get observedAttributes() {
    return ["condition"];
  }

  private _content: DocumentFragment;

  constructor() {
    super();
    this._content = this._document.createDocumentFragment();
  }

  connectedCallback() {
    super.connectedCallback();
    // Store the initial content
    while (this.firstChild) {
      this._content.appendChild(this.firstChild);
    }
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "condition") {
      this.render();
    }
  }

  private evaluateCondition(): boolean {
    const condition = this.getAttribute("condition");
    if (!condition) return false;

    try {
      // Use Function to evaluate the condition in the context of _global
      return new Function("global", `with(global) { return ${condition}; }`)(this._global);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  }

  protected renderContent(): string {
    if (this.evaluateCondition()) {
      return this.renderChildNodes(this._content.childNodes);
    }
    return "";
  }

  protected hydrate() {
    // For client-side, we need to re-render to ensure the condition is evaluated
    this.render();
  }
}

// Only register the custom element if in a browser environment
if (isBrowser()) {
  customElements.define("ep-if", EPIf);
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-if": EPIf;
  }
}

export { EPIf };
