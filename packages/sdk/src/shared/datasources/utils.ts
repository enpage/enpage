export function stringifyObjectValues(
  obj: Record<string, string | number | Date | boolean>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value.toString()]));
}
