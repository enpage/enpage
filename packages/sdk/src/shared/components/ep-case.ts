import { HybridComponent } from "./hybrid-component";
import { isBrowser } from "./utils/is-browser";

/**
 * @class EPCase
 * @extends HybridComponent
 * @description A custom element that represents a case within an ep-switch element.
 * It defines a condition and content to be rendered when the condition is met.
 *
 * @property {string} value - The value or expression to match against the switch expression.
 * @property {boolean} default - Indicates if this case is the default fallback.
 * @property {string} compare - Custom comparison function for complex matching scenarios.
 * @property {boolean} nobreak - Allows execution to fall through to the next case if true.
 *
 * @example
 * <ep-switch expression="fruit">
 *   <ep-case value="'apple'">
 *     <p>It's an apple!</p>
 *   </ep-case>
 *   <ep-case value="'banana'" nobreak>
 *     <p>It's a banana!</p>
 *   </ep-case>
 *   <ep-case value="fruit => fruit.length > 5">
 *     <p>It's a fruit with a long name!</p>
 *   </ep-case>
 *   <ep-case default>
 *     <p>It's some other fruit.</p>
 *   </ep-case>
 * </ep-switch>
 *
 * @example
 * <ep-switch expression="number">
 *   <ep-case value="n => n % 2 === 0" compare="(caseValue, switchValue) => caseValue(switchValue)">
 *     <p>It's an even number!</p>
 *   </ep-case>
 *   <ep-case value="n => n % 2 !== 0" compare="(caseValue, switchValue) => caseValue(switchValue)">
 *     <p>It's an odd number!</p>
 *   </ep-case>
 * </ep-switch>
 */
class EPCase extends HybridComponent {
  static get observedAttributes() {
    return ["value", "default", "compare", "nobreak"];
  }

  private _value: string | null = null;
  private _isDefault: boolean = false;
  private _compareFunction: string | null = null;
  private _noBreak: boolean = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._value = this.getAttribute("value");
    this._isDefault = this.hasAttribute("default");
    this._compareFunction = this.getAttribute("compare");
    this._noBreak = this.hasAttribute("nobreak");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "value") {
      this._value = newValue;
    } else if (name === "default") {
      this._isDefault = this.hasAttribute("default");
    } else if (name === "compare") {
      this._compareFunction = newValue;
    } else if (name === "nobreak") {
      this._noBreak = this.hasAttribute("nobreak");
    }
  }

  matches(switchValue: any): boolean {
    if (this._isDefault) return false;
    if (this._value === null) return false;

    try {
      let caseValue = this.evaluateExpression(this._value);

      if (this._compareFunction) {
        const compareFunc = new Function(
          "global",
          "caseValue",
          "switchValue",
          `with(global) { return ${this._compareFunction}(caseValue, switchValue); }`,
        );
        return compareFunc(this._global, caseValue, switchValue);
      } else {
        // Default to strict equality
        return caseValue === switchValue;
      }
    } catch (error) {
      console.error("Error evaluating case:", error);
      return false;
    }
  }

  private evaluateExpression(expr: string): any {
    return new Function("global", `with(global) { return ${expr}; }`)(this._global);
  }

  isDefault(): boolean {
    return this._isDefault;
  }

  hasNoBreak(): boolean {
    return this._noBreak;
  }

  protected renderContent(): string {
    // The actual rendering is handled by the parent ep-switch
    return "";
  }

  protected hydrate() {
    // No specific hydration needed for ep-case
  }
}

// Only register the custom element if in a browser environment
if (isBrowser()) {
  customElements.define("ep-case", EPCase);
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-case": EPCase;
  }
}

export { EPCase };
