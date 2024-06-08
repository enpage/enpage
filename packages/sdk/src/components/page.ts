import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { provide } from "@lit/context";
import { enpageContext, type EnpageContext } from "../context";

@customElement("enpage-page")
class EnpagePage extends LitElement {
  @provide({ context: enpageContext })
  data: EnpageContext = {};

  static styles = css`
    :host {
      display: contents;
    }
  `;

  connectedCallback() {
    console.debug("enpage-page connected");
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    const scriptTag =
      document.querySelector("script#enpage-context") ?? document.querySelector("script#enpage-sample-data");
    if (scriptTag) {
      try {
        if (!scriptTag.textContent) throw new Error();
        this.data = JSON.parse(scriptTag.textContent);
        console.info("enpage-page data", this.data);
      } catch (e) {
        console.error("Invalid JSON data in script tag.", e);
      }
    } else {
      console.warn(
        '"enpage-context" script tag not found. This could be normal if you are designing a template locally, but not if you are simply using Enpage.',
      );
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "enpage-page": EnpagePage;
  }
}
