/**
 * Serialize a block manifest to a string so it can be stored in the DOM.
 */
export function serializeDomData(data: unknown): string {
  return encodeURIComponent(JSON.stringify(data));
}

/**
 * Unserialize a block manifest from a DOM element.
 */
export function unserializeDomData<T>(data: string): T {
  return JSON.parse(decodeURIComponent(data));
}

export function getElementLabel(element: HTMLElement) {
  return (
    element.getAttribute("ep-label") ?? element.getAttribute("title") ?? element.getAttribute("alt") ?? null
  );
}

type TemplateValue = string | number | boolean | null | undefined | TemplateValue[] | { toString(): string };

export function html(strings: TemplateStringsArray, ...values: TemplateValue[]): string {
  let result = "";

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += escapeHTML(values[i]);
    }
  }

  return result;
}

function escapeHTML(value: TemplateValue): string {
  if (value == null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(escapeHTML).join("");
  }

  const str = value.toString();
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}
