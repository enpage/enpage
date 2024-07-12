import { HybridComponent } from "./hybrid-component";
import { isBrowser } from "./utils/is-browser";

class EPLoop extends HybridComponent {
  static get observedAttributes() {
    return ["datasource", "source", "json", "range"];
  }

  private _template: HTMLTemplateElement | null = null;
  private _boundHandleDataChange: (event: CustomEvent) => void;

  constructor() {
    super();
    this.setState({ items: [] });
    this._boundHandleDataChange = this.handleDataChange.bind(this);
  }

  public connectedCallback() {
    super.connectedCallback();
    this._template = this._document.querySelector("template");
    if (!this._template) {
      console.error("ep-loop: <template> element is required");
      return;
    }
    this.updateItems();
    this.setupEventListener();
  }

  public disconnectedCallback() {
    this.removeCustomEventListener();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.updateItems();
  }

  private setupEventListener() {
    if (isBrowser()) {
      this._global.addEventListener("ep-data-changed", this._boundHandleDataChange);
    }
  }

  private removeCustomEventListener() {
    if (isBrowser()) {
      this._global.removeEventListener("ep-data-changed", this._boundHandleDataChange);
    }
  }

  private handleDataChange(event: CustomEvent) {
    const datasource = this.getAttribute("datasource");
    if (datasource && event.detail.path.startsWith(datasource)) {
      this.updateItems();
    }
  }

  private updateItems() {
    let items: any[] = [];

    if (this.hasAttribute("datasource")) {
      const path = this.getAttribute("datasource")!.split(".");
      let data = this._global.enpage?.data;
      for (const key of path) {
        data = data?.[key];
      }
      items = Array.isArray(data) ? data : Object.entries(data || {});
    } else if (this.hasAttribute("source")) {
      const sourceElement = this._document.getElementById(this.getAttribute("source")!);
      if (sourceElement && sourceElement.textContent) {
        items = JSON.parse(sourceElement.textContent);
      }
    } else if (this.hasAttribute("json")) {
      items = JSON.parse(this.getAttribute("json")!);
    } else if (this.hasAttribute("range")) {
      const [start, end] = this.getAttribute("range")!.split("-").map(Number);
      items = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    this.setState({ items });
  }

  private bindElement(element: Element, item: any, index: number) {
    if (element.hasAttribute("ep-bind")) {
      const prop = element.getAttribute("ep-bind")!;
      element.textContent = item[prop] || "";
    }

    if (element.hasAttribute("ep-bind-attr")) {
      const bindings = element.getAttribute("ep-bind-attr")!.split(",");
      bindings.forEach((binding) => {
        const [attr, prop] = binding.trim().split(":");
        element.setAttribute(attr, item[prop] || "");
      });
    }

    if (element.hasAttribute("ep-bind-key")) {
      element.textContent = Array.isArray(item) ? index.toString() : Object.keys(item)[0];
    }

    if (element.hasAttribute("ep-bind-key-attr")) {
      const bindings = element.getAttribute("ep-bind-key-attr")!.split(",");
      bindings.forEach((binding) => {
        const [attr, _] = binding.trim().split(":");
        element.setAttribute(attr, Array.isArray(item) ? index.toString() : Object.keys(item)[0]);
      });
    }

    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        this.bindElement(child as Element, item, index);
      }
    });
  }

  protected renderContent(): string {
    if (!this._template) {
      return "<div>Template is missing</div>";
    }

    const items = this.getState("items") as any[];
    return items
      .map((item, index) => {
        const clone = this._template!.content.cloneNode(true) as DocumentFragment;
        clone.childNodes.forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            this.bindElement(child as Element, item, index);
          }
        });
        return Array.from(clone.childNodes)
          .map((node) => this.nodeToString(node))
          .join("");
      })
      .join("");
  }

  protected hydrate() {
    // Re-render if needed
    this.render();
  }
}

// Only register the custom element if in a browser environment
if (isBrowser()) {
  customElements.define("ep-loop", EPLoop);
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-loop": EPLoop;
  }
}

export { EPLoop };
