import { CustomElement } from "./custom-element";
import { Type, type Static, type TObject, type TProperties } from "@sinclair/typebox";

export abstract class EPBlockBase extends CustomElement {
  static baseStyles = ``;

  static get observedAttributes() {
    return ["ep-label"];
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  toJSON(): Record<string, unknown> {
    const attrs = this.getAttributeNames().reduce(
      (acc, name) => {
        acc[name] = this.getAttribute(name);
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return {
      $tag: this.tagName.toLowerCase(),
      ...attrs,
    };
  }

  protected get contents(): string {
    return "<slot></slot>";
  }
}

export const baseManifest = Type.Object({
  type: Type.String(),
  title: Type.String(),
  description: Type.String(),
  icon: Type.String(),
  template: Type.String(),
  props: Type.Object({}),
});

export function defineBlockManifest<
  BType extends string,
  BTitle extends string,
  BIcon extends string,
  BTemplate extends string,
  BDesc extends string,
  BProps extends TProperties,
>({
  type,
  title,
  description,
  icon,
  template,
  props,
}: {
  type: BType;
  title: BTitle;
  icon: BIcon;
  template: BTemplate;
  description: BDesc;
  props: TObject<BProps>;
}) {
  return Type.Object({
    type: Type.Literal(type),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    template: Type.Literal(template),
    props,
  });
}

export type BlockManifest = ReturnType<typeof defineBlockManifest>;
export type Block = Static<ReturnType<typeof defineBlockManifest>>;

export function registerElement(
  element: {
    new (): EPBlockBase;
  },
  manifest: Static<ReturnType<typeof defineBlockManifest>>,
) {
  if (typeof customElements !== "undefined" && !customElements.get(manifest.type)) {
    customElements.define(manifest.type, element);
  }
}
