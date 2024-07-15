import { CustomElement } from "../base/custom-element";

class EPFor extends CustomElement {
  static get observedAttributes() {
    return ["datasource", "source", "json", "range"];
  }

  private _template: HTMLTemplateElement | null = null;
  private _boundHandleDataChange: (event: CustomEvent<{ path: string }>) => void;

  constructor() {
    super();
    this._boundHandleDataChange = this.handleDataChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._template = this.querySelector("template");
    if (!this._template) {
      console.error("ep-for: <template> element is required");
      return;
    }
    this.updateItems();
    this.setupEventListener();
    this.render();
  }

  disconnectedCallback() {
    this.removeCustomEventListener();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.updateItems();
  }

  private setupEventListener() {
    window.addEventListener("ep-data-changed", this._boundHandleDataChange as EventListener);
  }

  private removeCustomEventListener() {
    window.removeEventListener("ep-data-changed", this._boundHandleDataChange as EventListener);
  }

  private handleDataChange(event: CustomEvent<{ path: string }>) {
    const datasource = this.getAttribute("datasource");
    if (datasource && event.detail.path.startsWith(datasource)) {
      this.updateItems();
    }
  }

  private updateItems() {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let items: any[] = [];

    if (this.hasAttribute("datasource")) {
      const path = this.getAttribute("datasource")!.split(".");
      let data = window.enpage.context.data;
      if (data) {
        for (const key of path) {
          // @ts-ignore ignore for now but we should fix this type error
          data = data?.[key];
        }
      }
      items = Array.isArray(data) ? data : Object.entries(data || {});
    } else if (this.hasAttribute("source")) {
      const sourceElement = document.getElementById(this.getAttribute("source")!);
      if (sourceElement?.textContent) {
        items = JSON.parse(sourceElement.textContent);
      }
    } else if (this.hasAttribute("json")) {
      items = JSON.parse(this.getAttribute("json")!);
    } else if (this.hasAttribute("range")) {
      const [start, end] = this.getAttribute("range")!.split("-").map(Number);
      items = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    this.render(items);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

  protected get template(): string {
    return "<slot></slot>";
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  protected render(items: any[] = []): void {
    super.render();

    if (!this._template) {
      this.innerHTML = "Template is missing";
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      const clone = this._template!.content.cloneNode(true) as DocumentFragment;
      clone.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          this.bindElement(child as Element, item, index);
        }
      });
      fragment.appendChild(clone);
    });

    this.innerHTML = "";
    this.appendChild(fragment);
  }
}

customElements.define("ep-for", EPFor);

declare global {
  interface HTMLElementTagNameMap {
    "ep-for": EPFor;
  }
}

export { EPFor };
