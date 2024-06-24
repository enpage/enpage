import type { AttributesMap } from "@enpage/types/attributes";
import {
  AttrText,
  AttrNumber,
  AttrBoolean,
  AttrEnum,
  AttrEnumOption,
  AttrFile,
  AttrUrl,
  AttrColor,
} from "@enpage/types/attributes";

export function defineAttributes(attrs: AttributesMap) {
  return attrs;
}

export const attr = {
  /**
   * Define a text attribute
   */
  text(name: string, opts?: Omit<AttrText, "name" | "type">) {
    return {
      type: "text",
      name,
      ...opts,
    } as const satisfies AttrText;
  },
  /**
   * Define a number attribute
   */
  number(name: string, opts?: Omit<AttrNumber, "name" | "type">) {
    return {
      type: "number",
      name,
      displayAs: "input",
      ...opts,
    } as const satisfies AttrNumber;
  },
  /**
   * Define a boolean attribute
   */
  boolean(name: string, opts?: Omit<AttrBoolean, "name" | "type">) {
    return {
      type: "boolean",
      name,
      ...opts,
    } as const satisfies AttrBoolean;
  },
  /**
   * Define an enum attribute
   */
  enum<O extends string>(name: string, opts: Omit<AttrEnum<O>, "name" | "type">) {
    return {
      type: "enum",
      name,
      ...opts,
    } as const satisfies AttrEnum<O>;
  },
  /**
   * Define a file attribute
   */
  file(
    name: string,
    opts: Omit<AttrFile, "name" | "type"> = {
      accept: ["*"],
    },
  ) {
    return {
      type: "file",
      name,
      ...opts,
    } as const satisfies AttrFile;
  },
  /**
   * Define a URL attribute
   */
  url(name: string, opts: Omit<AttrUrl, "name" | "type"> = {}) {
    return {
      type: "url",
      name,
      ...opts,
    } as const satisfies AttrUrl;
  },
  /**
   * Define a color attribute
   */
  color(name: string, opts: Omit<AttrColor, "name" | "type"> = {}) {
    return {
      type: "color",
      name,
      ...opts,
    } as const satisfies AttrColor;
  },
};
