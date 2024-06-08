import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { enpageContext, type EnpageContext } from "../context";
import install from "@twind/with-web-components";
import config from "../twind.config";

const withTwind = install(config);

/**
 * ## `<enpage-loop>`
 *
 * The `<enpage-loop>` component is a custom element that can dynamically render repeated content based on various data sources.
 *
 * ### Attributes
 *
 * - `context`: A comma or space-separated list of paths to properties in the context data provided by `<enpage-page>`.
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
 *         ]
 *       },
 *       "instagramData": {
 *         "items": [
 *           { "url": "http://instagram.com/1", "name": "Photo 1", "title": "Title 1" },
 *           { "url": "http://instagram.com/2", "name": "Photo 2", "title": "Title 2" }
 *         ]
 *       }
 *     }
 *   </script>
 *   <ul class="gap-2">
 *     <enpage-loop context="youtubeData.items, instagramData.items">
 *       <li>
 *         <a data-bind-attr="href:url, title:title">
 *           <span data-bind="name"></span>
 *         </a>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *   <ul class="gap-2">
 *     <enpage-loop json='[{"url": "http://example.com", "name": "Example", "title": "Example Site"}]'>
 *       <li>
 *         <a data-bind-attr="href:url, title:title">
 *           <span data-bind="name"></span>
 *         </a>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *   <ul class="gap-2">
 *     <enpage-loop range="1-3">
 *       <li>
 *         Range value: <span data-bind="value"></span>
 *       </li>
 *     </enpage-loop>
 *   </ul>
 *   <script type="application/json" id="example-source">
 *     [{"url": "http://example.com/1", "name": "Example 1", "title": "Example Title 1"},
 *      {"url": "http://example.com/2", "name": "Example 2", "title": "Example Title 2"}]
 *   </script>
 *   <ul class="gap-2">
 *     <enpage-loop source="example-source">
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
 *
 * Example:
 *
 * ```html
 * <li>
 *   <a data-bind-attr="href:url, title:title">
 *     <span data-bind="name"></span>
 *   </a>
 * </li>
 * ```
 */
@customElement("enpage-loop")
@withTwind
class EnpageLoop extends LitElement {
  @consume({ context: enpageContext, subscribe: true })
  @state()
  contextData: EnpageContext = {};

  @property({ type: Array }) items: Array<any> = [];
  @property({ type: String }) context: string = "";
  @property({ type: String }) source: string = "";
  @property({ type: String }) json: string = "";
  @property({ type: String }) range: string = "";

  static styles = css`
    :host {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    try {
      if (this.source) {
        this.items = this.getDataFromSource();
      } else if (this.json) {
        this.items = JSON.parse(this.json);
      } else if (this.range) {
        const [start, end] = this.range.split("-").map(Number);
        if (isNaN(start) || isNaN(end)) {
          console.error('<enpage-loop>: Invalid range attribute. Expected format "start-end" with numbers.');
          this.items = [];
        } else {
          this.items = Array.from({ length: end - start + 1 }, (_, i) => ({ value: start + i }));
        }
      } else if (this.context) {
        const paths = this.context
          .split(/[,\s]+/)
          .map((p) => p.trim())
          .filter(Boolean);
        this.items = this.getNestedProperties(this.contextData, paths) || [];
      } else {
        console.warn(
          "<enpage-loop>: No data source specified. Please provide a context, source, json, or range attribute.",
        );
        this.items = [];
      }
    } catch (e) {
      console.error("<enpage-loop>: Error fetching data:", e);
      this.items = [];
    }
  }

  getDataFromSource(): Array<any> {
    const scriptTag = document.getElementById(this.source) as HTMLScriptElement;
    if (scriptTag && scriptTag.type === "application/json") {
      try {
        return JSON.parse(scriptTag.textContent || "");
      } catch (e) {
        console.error("<enpage-loop>: Invalid JSON in script tag:", e);
        return [];
      }
    } else {
      console.warn(
        `<enpage-loop>: Script tag with id "${this.source}" not found or is not of type "application/json".`,
      );
      return [];
    }
  }

  getNestedProperties(obj: EnpageContext, paths: string[]) {
    return paths.reduce((acc: any[], path: string) => {
      const value = path.split(".").reduce((o, p) => o && o[p], obj);
      if (Array.isArray(value)) {
        acc.push(...value);
      } else if (value !== undefined) {
        acc.push(value);
      } else {
        console.warn(`<enpage-loop>: Path "${path}" not found in context data.`);
      }
      return acc;
    }, []);
  }

  bindData(element: Element, data: any) {
    element.querySelectorAll("[data-bind]").forEach((bindElement) => {
      const bindKey = bindElement.getAttribute("data-bind");
      if (bindKey && data[bindKey] !== undefined) {
        bindElement.textContent = data[bindKey];
      } else {
        console.warn(`<enpage-loop>: Data binding key "${bindKey}" not found in data:`, data);
      }
    });

    element.querySelectorAll("[data-bind-attr]").forEach((bindElement) => {
      const bindAttrs = bindElement.getAttribute("data-bind-attr");
      if (bindAttrs) {
        bindAttrs.split(/[,\s]+/).forEach((attrPair) => {
          const [attr, bindKey] = attrPair.split(":").map((part) => part.trim());
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
  }

  render() {
    const content = Array.from(this.children).filter((child) => !(child instanceof HTMLTemplateElement));

    return html`
      ${this.items.map((item) => {
        const clonedContent = content.map((child) => {
          const clone = child.cloneNode(true) as HTMLElement;
          this.bindData(clone, item);
          return clone;
        });
        return html`${clonedContent}`;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "enpage-loop": EnpageLoop;
  }
}
