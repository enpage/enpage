import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ep-switch")
export class EnpageSwitch extends LitElement {
  @property({ type: String }) value: string = "";

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-switch": EnpageSwitch;
  }
}
