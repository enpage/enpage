import { EPBlockBase, registerElement } from "../base/ep-block-base";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { defineBlockManifest } from "../base/ep-block-base";
import html from "~/shared/html-template-tag";

export class GridBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "direction", "columns", "rows", "gap"];
  }

  static get manifest() {
    return manifest;
  }

  get direction() {
    return (this.getAttribute("direction") as Manifest["props"]["direction"]) || defaults.props.direction;
  }

  set direction(value: Manifest["props"]["direction"]) {
    this.setAttribute("direction", value);
  }

  get columns() {
    return this.getAttribute("columns") || defaults.props.columns;
  }

  set columns(value: string) {
    this.setAttribute("columns", value);
  }

  get rows() {
    return this.getAttribute("rows") || defaults.props.rows;
  }

  set rows(value: string) {
    this.setAttribute("rows", value);
  }

  get gap() {
    return this.getAttribute("gap") || defaults.props.gap;
  }

  set gap(value: string) {
    this.setAttribute("gap", value);
  }

  render() {
    this.style.display = "grid";
    this.style.gridAutoFlow = this.direction === "horizontal" ? "column" : "row";
    this.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    this.style.gap = this.gap;

    return this.outerHTML;
  }
}

export const manifest = defineBlockManifest({
  type: "ep-grid",
  title: "Grid",
  description: "A configurable grid layout",
  icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
  </svg>`,
  template: html`<ep-grid ep-label="Grid" ep-editable>
    <div>Grid Item 1</div>
    <div>Grid Item 2</div>
    <div>Grid Item 3</div>
    <div>Grid Item 4</div>
  </ep-grid>`,
  props: Type.Object({
    direction: Type.Union(
      [
        Type.Literal("horizontal", { title: "Horizontal", description: "Horizontal layout" }),
        Type.Literal("vertical", { title: "Vertical", description: "Vertical layout" }),
      ],
      {
        default: "horizontal",
        title: "Direction",
        description: "The layout direction of the grid",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    columns: Type.String({
      default: "2",
      title: "Columns",
      description: "Number of columns in the grid",
    }),
    rows: Type.String({
      default: "2",
      title: "Rows",
      description: "Number of rows in the grid",
    }),
    gap: Type.String({
      default: "1rem",
      title: "Gap",
      description: "Gap between grid items",
    }),
  }),
});

export type Manifest = Static<typeof manifest>;

export const defaults = Value.Create(manifest);

declare global {
  interface HTMLElementTagNameMap {
    "ep-grid": GridBlock;
  }
}

export function register() {
  registerElement(GridBlock, defaults);
}

register();
