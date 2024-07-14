import { CustomElement } from "../base/custom-element";

class EPSwitch extends CustomElement {
  private _cases: EPCase[] = [];
  private _default: EPCase | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerCases();
    this.render();
  }

  private registerCases() {
    this._cases = Array.from(this.querySelectorAll("ep-case:not([default])")) as EPCase[];
    this._default = this.querySelector("ep-case[default]") as EPCase | null;
  }

  protected get template(): string {
    return "<slot></slot>";
  }

  render(): void {
    super.render();

    const matchedCase = this._cases.find((caseElement) => caseElement.evaluateCondition());

    this._cases.forEach((caseElement) => {
      caseElement.style.display = "none";
    });

    if (this._default) {
      this._default.style.display = "none";
    }

    if (matchedCase) {
      matchedCase.style.display = "";
    } else if (this._default) {
      this._default.style.display = "";
    }
  }
}

class EPCase extends CustomElement {
  static get observedAttributes() {
    return ["value"];
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "value") {
      (this.parentElement as EPSwitch)?.render();
    }
  }

  evaluateCondition(): boolean {
    const value = this.getAttribute("value");
    if (!value) return false;

    const switchElement = this.closest("ep-switch") as EPSwitch;
    if (!switchElement) return false;

    try {
      // Create a sandbox object with allowed globals
      const sandbox = {
        ...window,
        self: switchElement,
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
      const safeEval = new Function("ctx", `return (${value});`);
      return safeEval.call(safeGlobal);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  }

  protected get template(): string {
    return "<slot></slot>";
  }
}

customElements.define("ep-switch", EPSwitch);
customElements.define("ep-case", EPCase);

declare global {
  interface HTMLElementTagNameMap {
    "ep-switch": EPSwitch;
    "ep-case": EPCase;
  }
}

export { EPSwitch, EPCase };
