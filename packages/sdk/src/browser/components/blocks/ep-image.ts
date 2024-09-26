import { EPBlockBase, registerElement } from "../base/ep-block-base";
import { Type, type Static } from "@sinclair/typebox";
import { defineBlockManifest } from "../base/ep-block-base";
import { Value } from "@sinclair/typebox/value";
import html from "~/shared/html-template-tag";

export class ImageBlock extends EPBlockBase {
  static get observedAttributes() {
    return [...super.observedAttributes, "src", "alt", "width", "height"];
  }

  static get manifest() {
    return manifest;
  }

  get src() {
    return (
      this.getAttribute("src") || "https://picsum.photos/500/300/?blur"
      // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM84wMAAeoBGpsbXSsAAAAASUVORK5CYII="
      // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM84wMAAeoBGpsbXSsAAAAASUVORK5CYII="
    );
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  get height() {
    return this.getAttribute("height") ?? defaults.props.height;
  }

  set height(value: string | number) {
    this.setAttribute("height", value.toString());
  }

  get width() {
    return this.getAttribute("width") ?? defaults.props.width;
  }

  set width(value: string | number) {
    this.setAttribute("width", value.toString());
  }

  get alt() {
    return this.getAttribute("alt") || "";
  }

  set alt(value: string) {
    this.setAttribute("alt", value);
  }

  render() {
    const picture = document.createElement("picture");
    const img = document.createElement("img");
    this.classList.add("resizable");
    img.src = this.src;
    img.alt = this.alt;
    if (typeof this.width === "number") {
      img.width = this.width;
    } else {
      img.style.width = this.width;
    }
    if (typeof this.height === "number") {
      img.height = this.height;
    } else {
      img.style.height = this.height;
    }
    picture.appendChild(img);

    this.replaceChildren(picture);

    // const handleBottom = document.createElement("div");
    // handleBottom.classList.add("resize-handle", "handle-bottom");
    // this.appendChild(handleBottom);

    return picture.outerHTML;
  }
}

export const manifest = defineBlockManifest({
  type: "ep-image",
  title: "Image",
  description: "An image block",
  icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  <circle cx="8.5" cy="8.5" r="1.5"></circle>
  <polyline points="21 15 16 10 5 21"></polyline>
</svg>`,
  template: html`<ep-image ep-editable ep-label="Image" src="https://picsum.photos/500/300"></ep-image>`,
  props: Type.Object({
    src: Type.String({
      default: "",
      title: "File",
      description: "The image source",
      format: "data-url",
      "ui:field": "file",
    }),
    alt: Type.String({
      default: "",
      title: "Alternate text",
      description: "Useful for search engines as well as screen readers.",
    }),
    width: Type.String({
      default: "100%",
      title: "Width",
      description: "The image width",
      "ui:field": "dimension",
    }),
    height: Type.String({
      default: "auto",
      title: "Height",
      description: "The image height",
      "ui:field": "dimension",
    }),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

declare global {
  interface HTMLElementTagNameMap {
    "ep-image": ImageBlock;
  }
}

registerElement(ImageBlock, defaults);
