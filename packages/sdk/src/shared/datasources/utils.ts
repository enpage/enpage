import { get } from "lodash-es";

export function stringifyObjectValues(
  obj: Record<string, string | number | Date | boolean>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value.toString()]));
}

export function createPlaceholderReplacer(attr: Record<string, unknown>) {
  return function replacePlaceholders(_: unknown, p1: string) {
    const varName = (p1 as string).trim();
    return String(get(attr, varName)) ?? "";
  };
}

export const placeholderRx = /{{(.+?)}}/g;
