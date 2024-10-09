// Helper function to flatten nested objects
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function flattenObject(obj: Record<string, any>, prefix = ""): Record<string, string> {
  return Object.keys(obj).reduce(
    (acc, k) => {
      const pre = prefix.length ? `${prefix}-` : "";
      if (typeof obj[k] === "object" && obj[k] !== null && !("type" in obj[k])) {
        Object.assign(acc, flattenObject(obj[k], `${pre}${k}`));
      } else if (typeof obj[k] === "object" && "value" in obj[k]) {
        acc[`${pre}${k}`] = obj[k].value;
      } else {
        acc[`${pre}${k}`] = obj[k];
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
