import {
  AttrText,
  AttrNumber,
  AttrBoolean,
  AttrEnum,
  AttrEnumOption,
  AttrFile,
  AttrUrl,
  AttrColor,
} from "@enpage/types";
import { RunContextType } from "./types";
export * from "clsx";

export const attr = {
  text(name: string, opts?: Omit<AttrText, "name" | "type">) {
    return {
      type: "text",
      name,
      ...opts,
    } as const satisfies AttrText;
  },
  number(name: string, opts?: Omit<AttrNumber, "name" | "type">) {
    return {
      type: "number",
      name,
      displayAs: "input",
      ...opts,
    } as const satisfies AttrNumber;
  },
  boolean(name: string, opts?: Omit<AttrBoolean, "name" | "type">) {
    return {
      type: "boolean",
      name,
      ...opts,
    } as const satisfies AttrBoolean;
  },
  enum<O extends string>(name: string, opts: Omit<AttrEnum<O>, "name" | "type">) {
    return {
      type: "enum",
      name,
      ...opts,
    } as const satisfies AttrEnum<O>;
  },
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
  url(name: string, opts: Omit<AttrUrl, "name" | "type"> = {}) {
    return {
      type: "url",
      name,
      ...opts,
    } as const satisfies AttrUrl;
  },
  color(name: string, opts: Omit<AttrColor, "name" | "type"> = {}) {
    return {
      type: "color",
      name,
      ...opts,
    } as const satisfies AttrColor;
  },
};

export function isEditMode(ctx: RunContextType) {
  return ctx.mode === "edit";
}
