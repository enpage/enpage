import { getGlobalAndDocument } from "./utils/global";
import { isBrowser } from "./utils/is-browser";

// Base class for hybrid components
abstract class HybridComponent extends HTMLElement {
  private _state: Record<string, any> = {};
  private _observers: Set<() => void> = new Set();
  protected _global: any;
  protected _document: Document;

  static styles: string = "";

  constructor() {
    super();
    const { global, document } = getGlobalAndDocument();
    this._global = global;
    this._document = document;
    if (isBrowser() && !this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
  }

  // Lifecycle Hooks
  protected beforeRender() {}
  protected afterRender() {}
  protected beforeHydrate() {}
  protected afterHydrate() {}

  private getStyles(): string {
    const styles = (this.constructor as typeof HybridComponent).styles;
    return styles ? `<style>${styles}</style>` : "";
  }

  // State Management
  protected setState(newState: Partial<typeof this._state>) {
    Object.assign(this._state, newState);
    this._observers.forEach((callback) => callback());
    this.render();
  }

  protected getState<K extends keyof typeof this._state>(key: K): (typeof this._state)[K] {
    return this._state[key];
  }

  protected observe(callback: () => void) {
    this._observers.add(callback);
    return () => this._observers.delete(callback);
  }

  // Attribute Reflection
  static get observedAttributes(): string[] {
    return [];
  }

  protected syncAttributesToProperties() {
    (this.constructor as typeof HybridComponent).observedAttributes.forEach((attr) => {
      if (!this.hasOwnProperty(attr)) {
        Object.defineProperty(this, attr, {
          get: () => this.getAttribute(attr),
          set: (value) => {
            if (value === null) {
              this.removeAttribute(attr);
            } else {
              this.setAttribute(attr, value);
            }
          },
        });
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.syncAttributesToProperties();
    if (isBrowser()) {
      this.beforeHydrate();
      // Check if we need to hydrate
      if (!this.shadowRoot && this.querySelector("template[shadowroot]")) {
        this.attachShadow({ mode: "open" }).appendChild(
          this.querySelector<HTMLTemplateElement>("template[shadowroot]")!.content.cloneNode(true),
        );
      }
      this.hydrate();
      this.afterHydrate();
      // Only render on the client if there's no server-rendered content
      if (!this.querySelector("template[shadowroot]")) {
        this.render();
      }
    }
  }

  // Method to render the component
  render(): string | void {
    this.beforeRender();
    const styles = this.getStyles();
    const content = this.renderContent();
    if (isBrowser()) {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = styles + content;
      }
      this.afterRender();
    } else {
      // Server-side rendering
      return `<template shadowroot="open">${styles}${content}</template>`;
    }
  }

  protected renderChildNodes(nodes: NodeListOf<ChildNode> | ChildNode[]): string {
    return Array.from(nodes)
      .map((node) => this.nodeToString(node))
      .join("");
  }

  protected nodeToString(node: ChildNode): string {
    if (node instanceof Element) {
      return node.outerHTML;
    } else if (node instanceof Text) {
      return node.textContent || "";
    } else if (node instanceof Comment) {
      return `<!--${node.textContent}-->`;
    } else {
      return "";
    }
  }

  // Abstract method to render content (used by both server and client rendering)
  protected abstract renderContent(): string;

  // Hydration method
  protected abstract hydrate(): void;
}

export { HybridComponent };
