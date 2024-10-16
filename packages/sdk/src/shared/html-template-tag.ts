/**
 * An enhanced template tag function for creating HTML strings with interpolated values.
 * It escapes special characters in interpolated values to prevent XSS attacks,
 * unless the value is prefixed with "$", in which case it's inserted as raw HTML.
 *
 * @param strings - The string literals in the template
 * @param values - The interpolated values
 * @returns The resulting HTML string
 */
export default function html(strings: TemplateStringsArray, ...values: any[]): string {
  const escapeHTML = (str: string): string => {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  };

  return strings.reduce((result, string, i) => {
    const value = values[i - 1];
    if (value === undefined) {
      return result + string;
    }

    if (typeof value === "string" && value.startsWith("$")) {
      // If the value starts with '$', insert it as raw HTML
      return result + value.slice(1) + string;
    }

    if (Array.isArray(value)) {
      return (
        result +
        value
          .map((item) =>
            typeof item === "string" && item.startsWith("$") ? item.slice(1) : escapeHTML(String(item)),
          )
          .join("") +
        string
      );
    }

    if (typeof value === "function") {
      return result + escapeHTML(String(value())) + string;
    }

    return result + escapeHTML(String(value)) + string;
  }, "");
}
