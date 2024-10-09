import { CustomElement } from "../base/custom-element";

class EPIf extends CustomElement {
  static get observedAttributes() {
    return ["condition"];
  }

  private _content: DocumentFragment;

  constructor() {
    super();
    this._content = document.createDocumentFragment();
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
    if (name === "condition") {
      this.render();
    }
  }

  private evaluateCondition(): boolean {
    const condition = this.getAttribute("condition");
    if (!condition) return false;

    try {
      // Create a sandbox object with allowed globals
      const sandbox = {
        ...window,
        self: this,
        // Add any other safe globals here
      };

      // Use a proxy to prevent access to unsafe globals
      const safeGlobal = new Proxy(sandbox, {
        has: () => true,
        get: (target, key) => {
          if (key in target) {
            return target[key as keyof typeof target];
          }
          throw new Error(`Access to '${String(key)}' is not allowed in condition evaluation`);
        },
      });

      // Evaluate the condition in the context of the safe global object
      const safeEval = new Function("ctx", `return (${condition});`);
      return safeEval.call(safeGlobal);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  }

  protected get contents(): string {
    return "<slot></slot>";
  }

  protected render(): void {
    if (this.evaluateCondition()) {
      this.replaceChildren(this._content.cloneNode(true));
    } else {
      this.innerHTML = "";
    }
  }
}

customElements.define("ep-if", EPIf);

declare global {
  interface HTMLElementTagNameMap {
    "ep-if": EPIf;
  }
}

export { EPIf };
