import { HybridComponent } from "./hybrid-component";
import { EPCase } from "./ep-case";
import { isBrowser } from "./utils/is-browser";

/**
 * @class EPSwitch
 * @extends HybridComponent
 * @description A custom element that provides switch-case like conditional rendering.
 * It evaluates an expression and renders the matching case(s).
 *
 * @property {string} expression - The expression to evaluate for case matching.
 * @property {boolean} multiple - Whether to allow multiple matching cases to render.
 *
 * @example
 * <ep-switch expression="user.role">
 *   <ep-case value="'admin'" nobreak>
 *     <p>Admin content</p>
 *   </ep-case>
 *   <ep-case value="'moderator'">
 *     <p>Moderator content</p>
 *   </ep-case>
 *   <ep-case value="'user'">
 *     <p>User content</p>
 *   </ep-case>
 *   <ep-case default>
 *     <p>Default content</p>
 *   </ep-case>
 * </ep-switch>
 *
 * @example
 * <ep-switch expression="userAge" multiple>
 *   <ep-case value="age => age >= 18" nobreak>
 *     <p>Adult content</p>
 *   </ep-case>
 *   <ep-case value="age => age >= 13" nobreak>
 *     <p>Teen content</p>
 *   </ep-case>
 *   <ep-case value="age => age < 13">
 *     <p>Child content</p>
 *   </ep-case>
 * </ep-switch>
 */
class EPSwitch extends HybridComponent {
  static get observedAttributes() {
    return ["expression", "multiple"];
  }

  private _expression: string = "";
  private _multiple: boolean = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._expression = this.getAttribute("expression") || "";
    this._multiple = this.hasAttribute("multiple");
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "expression") {
      this._expression = newValue || "";
    } else if (name === "multiple") {
      this._multiple = this.hasAttribute("multiple");
    }
    this.render();
  }

  private evaluateExpression(): any {
    if (!this._expression) return undefined;

    try {
      return new Function("global", `with(global) { return ${this._expression}; }`)(this._global);
    } catch (error) {
      console.error("Error evaluating expression:", error);
      return undefined;
    }
  }

  protected renderContent(): string {
    const value = this.evaluateExpression();
    let content: string[] = [];
    let defaultContent = "";
    let shouldBreak = false;

    for (const child of Array.from(this.children)) {
      if (child instanceof EPCase) {
        if (!shouldBreak && child.matches(value)) {
          content.push(this.renderChildNodes(child.childNodes));
          if (!this._multiple && !child.hasNoBreak()) {
            shouldBreak = true;
          }
        } else if (child.isDefault()) {
          defaultContent = this.renderChildNodes(child.childNodes);
        }
      } else if (child instanceof EPSwitch) {
        // Handle nested ep-switch
        content.push(child.renderContent());
      }
    }

    return content.length > 0 ? content.join("") : defaultContent;
  }

  protected hydrate() {
    if (isBrowser()) {
      this.render();
    }
  }
}

// Only register the custom element if in a browser environment
if (isBrowser()) {
  customElements.define("ep-switch", EPSwitch);
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-switch": EPSwitch;
  }
}

export { EPSwitch };
