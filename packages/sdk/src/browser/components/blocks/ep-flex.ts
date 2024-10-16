import { EPBlockBase, registerElement } from "../base/ep-block-base";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { defineBlockManifest } from "../base/ep-block-base";
import html from "~/shared/html-template-tag";

export class FlexBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "direction", "wrap", "justifyContent", "alignItems", "gap"];
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

  get wrap() {
    return (this.getAttribute("wrap") as Manifest["props"]["wrap"]) || defaults.props.wrap;
  }

  set wrap(value: Manifest["props"]["wrap"]) {
    this.setAttribute("wrap", value);
  }

  get justifyContent() {
    return (
      (this.getAttribute("justifyContent") as Manifest["props"]["justifyContent"]) ||
      defaults.props.justifyContent
    );
  }

  set justifyContent(value: Manifest["props"]["justifyContent"]) {
    this.setAttribute("justifyContent", value);
  }

  get alignItems() {
    return (this.getAttribute("alignItems") as Manifest["props"]["alignItems"]) || defaults.props.alignItems;
  }

  set alignItems(value: Manifest["props"]["alignItems"]) {
    this.setAttribute("alignItems", value);
  }

  get gap() {
    return this.getAttribute("gap") || defaults.props.gap;
  }

  set gap(value: string) {
    this.setAttribute("gap", value);
  }

  render() {
    this.style.display = "flex";
    this.style.flexDirection = this.direction;
    this.style.flexWrap = this.wrap;
    this.style.justifyContent = this.justifyContent;
    this.style.alignItems = this.alignItems;
    this.style.gap = this.gap;

    return this.outerHTML;
  }
}

export const manifest = defineBlockManifest({
  type: "ep-flex",
  title: "Container",
  description: "A configurable flex layout container",
  icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
  </svg>`,
  template: html`<ep-flex ep-label="Flex Container" ep-editable>
    <div>Flex Item 1</div>
    <div>Flex Item 2</div>
    <div>Flex Item 3</div>
  </ep-flex>`,
  props: Type.Object({
    direction: Type.Union(
      [
        Type.Literal("row", { title: "Row", description: "Horizontal layout" }),
        Type.Literal("column", { title: "Column", description: "Vertical layout" }),
      ],
      {
        default: "row",
        title: "Direction",
        description: "The layout direction of the flex container",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    wrap: Type.Union(
      [
        Type.Literal("nowrap", { title: "No Wrap", description: "Single-line layout" }),
        Type.Literal("wrap", { title: "Wrap", description: "Multi-line layout" }),
      ],
      {
        default: "nowrap",
        title: "Wrap",
        description: "Whether the flex items should wrap",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    justifyContent: Type.Union(
      [
        Type.Literal("flex-start", { title: "Start", description: "Align items to the start" }),
        Type.Literal("center", { title: "Center", description: "Center align items" }),
        Type.Literal("flex-end", { title: "End", description: "Align items to the end" }),
        Type.Literal("space-between", { title: "Space Between", description: "Distribute items evenly" }),
        Type.Literal("space-around", {
          title: "Space Around",
          description: "Distribute items evenly with space around",
        }),
      ],
      {
        default: "flex-start",
        title: "Justify Content",
        description: "Alignment along the main axis",
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
    alignItems: Type.Union(
      [
        Type.Literal("stretch", {
          title: "Stretch",
          description: "Stretch items to fill the container",
          icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="7" y1="3" x2="7" y2="21"/>
            <line x1="12" y1="3" x2="12" y2="21"/>
            <line x1="17" y1="3" x2="17" y2="21"/>
          </svg>`,
        }),
        Type.Literal("flex-start", {
          title: "Start",
          description: "Align items to the start",
          icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="7" y="6" width="4" height="4" rx="1"/>
            <rect x="13" y="6" width="4" height="4" rx="1"/>
            <rect x="7" y="12" width="4" height="4" rx="1"/>
          </svg>`,
        }),
        Type.Literal("center", {
          title: "Center",
          description: "Center align items",
          icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="7" y="10" width="10" height="4" rx="1"/>
          </svg>`,
        }),
        Type.Literal("flex-end", {
          title: "End",
          description: "Align items to the end",
          icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="13" y="14" width="4" height="4" rx="1"/>
            <rect x="7" y="14" width="4" height="4" rx="1"/>
            <rect x="13" y="8" width="4" height="4" rx="1"/>
          </svg>`,
        }),
      ],
      {
        default: "stretch",
        title: "Align Items",
        description: "Alignment along the cross axis",
        "ui:field": "enum",
        "ui:display": "icon-group",
      },
    ),
    gap: Type.Union(
      [
        Type.Literal("none", { title: "None", description: "No gap" }),
        Type.Literal("0.5rem", { title: "Small", description: "" }),
        Type.Literal("1rem", { title: "Medium", description: "" }),
        Type.Literal("1.5rem", { title: "Large", description: "" }),
        Type.Literal("2rem", { title: "Extra Large", description: "" }),
      ],
      {
        default: "none",
        title: "Gap",
        description: "Gap between items",
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
  }),
});

export type Manifest = Static<typeof manifest>;

export const defaults = Value.Create(manifest);

declare global {
  interface HTMLElementTagNameMap {
    "ep-flex": FlexBlock;
  }
}

export function register() {
  registerElement(FlexBlock, defaults);
}

register();
