import { CustomElement } from "../base/custom-element";

class EPFor extends CustomElement {
  static get observedAttributes() {
    return ["datasource", "source", "json", "range"];
  }

  private _template: HTMLTemplateElement | null = null;
  private _items: unknown[] = [];
  private _boundHandleDataChange: (event: CustomEvent<{ path: string }>) => void;

  constructor() {
    super();
    this._boundHandleDataChange = this.handleDataChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateItems();
    this.setupEventListener();
  }

  disconnectedCallback() {
    this.removeCustomEventListener();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // ignore initiliazation
    if (oldValue === null) {
      return;
    }
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
    this._items = [];

    if (this.hasAttribute("datasource")) {
      const path = this.getAttribute("datasource")!.split(".");
      let data = window.enpage.context.data;
      if (data) {
        for (const key of path) {
          // @ts-ignore ignore for now but we should fix this type error
          data = data?.[key];
        }
      }
      if (!data) {
        console.error(`[ep-for] Data source not found: ${this.getAttribute("datasource")}`);
      }
      this._items = Array.isArray(data) ? data : Object.entries(data || {});
    } else if (this.hasAttribute("source")) {
      const sourceElement = document.getElementById(this.getAttribute("source")!);
      if (sourceElement?.textContent) {
        this._items = JSON.parse(sourceElement.textContent);
      }
    } else if (this.hasAttribute("json")) {
      this._items = JSON.parse(this.getAttribute("json")!);
    } else if (this.hasAttribute("range")) {
      const [start, end] = this.getAttribute("range")!.split("-").map(Number);
      this._items = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    this.render();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private bindElement(element: Element, item: any, index: number) {
    if (element.hasAttribute("ep-bind")) {
      const prop = element.getAttribute("ep-bind")!;
      element.textContent = item[prop] || "";
    }

    if (element.hasAttribute("ep-bind-attr")) {
      const bindings = element
        .getAttribute("ep-bind-attr")!
        .split(",")
        .map((s) => s.trim());
      bindings.forEach((binding) => {
        const [attr, prop] = binding.split(":").map((s) => s.trim());
        element.setAttribute(attr, item[prop] || "");
      });
    }

    if (element.hasAttribute("ep-bind-key")) {
      element.textContent = Array.isArray(item) ? index.toString() : Object.keys(item)[0];
    }

    if (element.hasAttribute("ep-bind-key-attr")) {
      const bindings = element
        .getAttribute("ep-bind-key-attr")!
        .split(",")
        .map((s) => s.trim());
      bindings.forEach((binding) => {
        const [attr, _] = binding.split(":").map((s) => s.trim());
        element.setAttribute(attr, Array.isArray(item) ? index.toString() : Object.keys(item)[0]);
      });
    }

    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        this.bindElement(child as Element, item, index);
      }
    });
  }

  get template(): HTMLTemplateElement {
    if (this._template) {
      return this._template;
    }
    this._template = this.querySelector("template[ep-for-template]");
    if (!this._template) {
      const template = document.createElement("template");
      template.setAttribute("ep-for-template", this.getAttribute("id") as string);
      template.innerHTML = this.innerHTML;
      this.appendChild(template);
      this._template = template;
      // clear innerHTML to prevent duplicate rendering
      this.querySelectorAll(":not(template[ep-for-template])").forEach((el) => el.remove());
    }
    return this._template;
  }

  protected get contents(): string {
    const fragment = document.createDocumentFragment();
    this._items.forEach((item, index) => {
      const clone = this.template.content.cloneNode(true) as DocumentFragment;
      clone.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          this.bindElement(child as Element, item, index);
        }
      });
      fragment.appendChild(clone);
    });

    // create string from fragment
    const temp = document.createElement("div");
    temp.appendChild(fragment);
    temp.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        (child as HTMLElement).setAttribute("ep-generated-by", this.getAttribute("id") as string);
      }
    });
    return temp.innerHTML;
  }

  // custom render for this element because we need to append the contents to the parent
  protected render() {
    // Create temporary container
    const temp = document.createElement("div");
    temp.innerHTML = this.contents;
    // clean previous rendering
    this.parentElement?.querySelectorAll(`[ep-generated-by="${this.getAttribute("id")}"]`).forEach((el) => {
      el.remove();
    });
    // append the contents to the parent
    this.parentElement?.append(...temp.childNodes);
    this.parentElement?.setAttribute("ep-editable", "");
  }
}

customElements.define("ep-for", EPFor);

declare global {
  interface HTMLElementTagNameMap {
    "ep-for": EPFor;
  }
}

export { EPFor };
