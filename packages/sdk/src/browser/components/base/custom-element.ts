import { customAlphabet } from "nanoid";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { HTMLElement as _HTMLElement, Window as _Window, Node } from "happy-dom-without-node";

const createRandomElementId = customAlphabet(
  "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789",
  7,
);

if (typeof HTMLElement === "undefined") {
  //@ts-ignore
  globalThis.HTMLElement = _HTMLElement;
  // GlobalRegistrator.register({ url: "http://ssr" });
}

export abstract class CustomElement extends HTMLElement {
  protected abstract render(): void;

  /**
   * Wheter the rendered content should be appended as children or as siblings
   */
  protected renderingMode: "children" | "sibling" = "children";

  get isSSR() {
    return typeof window === "undefined" || window.location.hostname === "ssr";
  }

  connectedCallback() {
    // if element has no ID, generate one
    if (!this.getAttribute("id")) {
      this.setAttribute("id", createRandomElementId());
    }
    // if (!this.hasChildNodes()) {
    //   console.log("render from upper connected callback");
    //   this.render();
    // }
  }

  // render() {
  //   // Create temporary container
  //   const temp = window.document.createElement("div");
  //   temp.innerHTML = this.contents;

  //   // Replace this element's children with the template content
  //   if (this.renderingMode === "children") {
  //     this.replaceChildren(...temp.childNodes);
  //   } else {
  //     // clean previous rendering
  //     this.parentElement?.querySelectorAll(`[ep-generated-by="${this.getAttribute("id")}"]`).forEach((el) => {
  //       el.remove();
  //     });

  //     // append the contents to the parent
  //     const childNodesArray = Array.from(temp.childNodes);
  //     // @ts-ignore ignore for now but we should fix this type error.
  //     this.parentElement?.append(...childNodesArray);
  //   }

  //   return this.outerHTML;
  // }

  static get observedAttributes(): string[] {
    return [];
  }
}
