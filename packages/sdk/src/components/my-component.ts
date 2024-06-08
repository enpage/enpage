import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-component")
class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const styleSheets = [...document.styleSheets].map((sheet) => sheet.cssRules).flat();
    const style = document.createElement("style");
    // @ts-ignore
    style.textContent = styleSheets.map((rule) => rule.cssText).join("\n");
    // @ts-ignore
    this.shadowRoot.appendChild(style);
  }

  render() {
    return html`<slot></slot>`;
  }
}
