import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { EnpageSwitch } from "./switch";

@customElement("ep-case")
class EnpageCase extends LitElement {
  @property({ type: String }) value: string = "";

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    const parentSwitch = this.closest("ep-switch") as EnpageSwitch;
    if (parentSwitch && parentSwitch.value === this.value) {
      return html`<slot></slot>`;
    }
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-case": EnpageCase;
  }
}
