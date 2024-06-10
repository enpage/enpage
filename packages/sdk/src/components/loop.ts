import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * ## `<enpage-loop>`
 *
 * The `<enpage-loop>` component is a custom element that can dynamically render repeated content based on various data sources, including arrays and objects.
 *
 * ### Attributes
 *
 * - `contextpath`: A dot-separated path to the property in the context data provided by `<enpage-page>` to loop through.
 * - `source`: The ID of a `<script>` tag containing JSON data to be used as the data source.
 * - `json`: A JSON string to be used as the data source.
 * - `range`: A range of numbers specified in the format "start-end" to generate a sequence of numbers.
 *
 * ### Example Usage
 *
 * ```html
 * <enpage-page>
 *   <script type="application/json" id="enpage-context">
 *     {
 *       "youtubeData": {
 *         "items": [
 *           { "url": "http://youtube.com/1", "name": "Video 1", "title": "Title 1" },
 *           { "url": "http://youtube.com/2", "name": "Video 2", "title": "Title 2" }
 *         ],
 *         "ids": { "first": 1, "second": 2 }
 *       },
 *       "instagramData": {
 *         "items": [
 *           { "url": "http://instagram.com/1", "name": "Photo 1", "title": "Title 1" },
 *           { "url": "http://instagram.com/2", "name": "Photo 2", "title": "Title 2" }
 *         ]
 *       }
 *     }
 *   </script>
 *
 *   <ul class="gap-2">
 *     <enpage-loop contextpath="youtubeData.items">
 *       <li>
 *         <a data-bind-attr="href:url, title:title">
 *           <span data-bind="name"></span>
 *         </a>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *
 *   <ul class="gap-2">
 *     <enpage-loop contextpath="youtubeData.ids">
 *       <li>
 *         <span data-bind-key></span>: <span data-bind="value"></span>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *
 *   <ul class="gap-2">
 *     <enpage-loop contextpath="youtubeData.ids">
 *       <li>
 *         <a data-bind-key-attr="data-id:key">
 *           ID: <span data-bind-key></span> - Value: <span data-bind="value"></span>
 *         </a>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *
 *   <ul class="gap-2">
 *     <enpage-loop contextpath="instagramData.items">
 *       <li>
 *         <a data-bind-attr="href:url, title:title">
 *           <span data-bind="name"></span>
 *         </a>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 * </enpage-page>
 * ```
 *
 * ### Data Binding
 *
 * The `<enpage-loop>` component uses the following custom data binding attributes:
 *
 * - `data-bind`: Bind the text content of an element to a property in the data.
 * - `data-bind-attr`: Bind an attribute of an element to a property in the data. The format is `attribute:property`.
 * - `data-bind-key`: Bind the text content of an element to the key of an object.
 * - `data-bind-key-attr`: Bind an attribute of an element to the key of an object. The format is `attribute:key`.
 *
 * Example:
 *
 * ```html
 * <li>
 *   <a data-bind-attr="href:url, title:title">
 *     <span data-bind="name"></span>
 *   </a>
 * </li>
 * <li>
 *   <a data-bind-key-attr="data-id:key">
 *     ID: <span data-bind-key></span> - Value: <span data-bind="value"></span>
 *   </a>
 * </li>
 * ```
 */
@customElement("enpage-loop")
class EnpageLoop extends LitElement {
  @property({ type: Array }) items: Array<any> = [];
  @property({ type: String }) contextpath: string = "";
  @property({ type: String }) source: string = "";
  @property({ type: String }) json: string = "";
  @property({ type: String }) range: string = "";

  static styles = css`
    :host {
      display: contents;
    }
    ::slotted(*) {
      all: initial;
      all: unset;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("contextpath") || changedProperties.has("source")) {
      this.fetchData();
    }
  }

  fetchData() {
    try {
      if (this.json) {
        this.items = JSON.parse(this.json);
      } else if (this.range) {
        const [start, end] = this.range.split("-").map(Number);
        if (isNaN(start) || isNaN(end)) {
          console.error('<enpage-loop>: Invalid range attribute. Expected format "start-end" with numbers.');
          this.items = [];
        } else {
          this.items = Array.from({ length: end - start + 1 }, (_, i) => ({ value: start + i }));
        }
      } else if (this.contextpath) {
        const result = this.getNestedProperty(window._enpageCtx, this.contextpath);
        this.processResult(result);
      } else if (this.source) {
        const result = this.getDataFromScript(this.source, this.contextpath);
        this.processResult(result);
      } else {
        console.warn(
          "<enpage-loop>: No data source specified. Please provide a contextpath, source, json, or range attribute.",
        );
        this.items = [];
      }
    } catch (e) {
      console.error("<enpage-loop>: Error fetching data:", e);
      this.items = [];
    }

    console.log("enpage-loop items", this.items);
  }

  getDataFromScript(scriptId: string, path: string): any {
    const scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (scriptTag && scriptTag.type === "application/json") {
      try {
        const data = JSON.parse(scriptTag.textContent || "{}");
        return this.getNestedProperty(data, path);
      } catch (e) {
        console.error(`<enpage-loop>: Invalid JSON in script tag "${scriptId}":`, e);
        return null;
      }
    } else {
      console.warn(`<enpage-loop>: Script tag with id "${scriptId}" not found or is not of type "application/json".`);
      return null;
    }
  }

  getNestedProperty(obj: any, path: string) {
    return path.split(".").reduce((o, p) => o && o[p], obj);
  }

  processResult(result: any) {
    if (Array.isArray(result)) {
      this.items = result;
    } else if (typeof result === "object" && result !== null) {
      this.items = Object.entries(result).map(([key, value]) => ({ key, value }));
    } else {
      this.items = [];
    }
  }

  bindData(fragment: DocumentFragment, data: any) {
    fragment.querySelectorAll("[data-bind]").forEach((bindElement) => {
      const bindKey = bindElement.getAttribute("data-bind");
      if (bindKey && data[bindKey] !== undefined) {
        bindElement.textContent = data[bindKey];
      } else {
        console.warn(`<enpage-loop>: Data binding key "${bindKey}" not found in data:`, data);
      }
    });

    fragment.querySelectorAll("[data-bind-attr]").forEach((bindElement) => {
      const bindAttrs = bindElement.getAttribute("data-bind-attr");
      if (bindAttrs) {
        bindAttrs.split(/[,\s]+/).forEach((attrPair) => {
          let [attr, bindKey] = attrPair.split(":").map((part) => part.trim());
          bindKey ??= attr;
          if (data[bindKey] !== undefined) {
            bindElement.setAttribute(attr, data[bindKey]);
          } else {
            console.warn(
              `<enpage-loop>: Data binding key "${bindKey}" not found in data for attribute "${attr}":`,
              data,
            );
          }
        });
      }
    });

    // Bind keys for objects
    fragment.querySelectorAll("[data-bind-key]").forEach((bindElement) => {
      if (data.key !== undefined) {
        bindElement.textContent = data.key;
      } else {
        console.warn(`<enpage-loop>: Data binding key "key" not found in data:`, data);
      }
    });

    // Bind attributes to keys for objects
    fragment.querySelectorAll("[data-bind-key-attr]").forEach((bindElement) => {
      const bindAttrs = bindElement.getAttribute("data-bind-key-attr");
      if (bindAttrs) {
        bindAttrs.split(/[,\s]+/).forEach((attrPair) => {
          let [attr, bindKey] = attrPair.split(":").map((part) => part.trim());
          bindKey ??= attr;
          if (data.key !== undefined) {
            bindElement.setAttribute(attr, data.key);
          } else {
            console.warn(
              `<enpage-loop>: Data binding key "${bindKey}" not found in data for attribute "${attr}":`,
              data,
            );
          }
        });
      }
    });
  }

  createRenderRoot() {
    // Use shadow DOM but manually adopt the styles from the document
    const root = super.createRenderRoot();
    if (this.shadowRoot) {
      const style = document.createElement("style");
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          Array.from(styleSheet.cssRules).forEach((rule) => {
            style.appendChild(document.createTextNode(rule.cssText));
          });
        } catch (e) {
          console.error(e);
        }
      });
      this.shadowRoot.appendChild(style);
    }
    return root;
  }

  render() {
    const templateElement = this.querySelector("template");
    if (!templateElement) {
      console.error("<enpage-loop>: No <template> element found.");
      return html``;
    }

    const templateContent = templateElement.content;

    return html`
      ${this.items.map((item) => {
        const clone = templateContent.cloneNode(true) as DocumentFragment;
        this.bindData(clone, item);
        return clone;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "enpage-loop": EnpageLoop;
  }
}
