import { getGlobalAndDocument } from "./global";
type TemplateValue = string | number | boolean | null | undefined | Node | DocumentFragment | TemplateValue[];

export function html(strings: TemplateStringsArray, ...values: TemplateValue[]): string {
  const { document } = getGlobalAndDocument();
  const result: string[] = [];

  strings.forEach((string, i) => {
    result.push(string);

    if (i < values.length) {
      const value = values[i];
      if (value instanceof DocumentFragment || value instanceof Node) {
        const temp = document.createElement("div");
        temp.appendChild(value.cloneNode(true));
        result.push(temp.innerHTML);
      } else if (Array.isArray(value)) {
        result.push(
          value
            .map((item) => {
              if (item instanceof DocumentFragment || item instanceof Node) {
                const temp = document.createElement("div");
                temp.appendChild(item.cloneNode(true));
                return temp.innerHTML;
              } else {
                return String(item);
              }
            })
            .join(""),
        );
      } else if (value != null) {
        result.push(String(value));
      }
    }
  });

  return result.join("");
}
