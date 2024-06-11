import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ep-if")
class EnpageIf extends LitElement {
  @property({ type: Boolean }) condition: boolean = false;

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    return this.condition ? html`<slot></slot>` : html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-if": EnpageIf;
  }
}
