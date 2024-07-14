import { JSDOM } from "jsdom";

interface StyleInfo {
  selector: string;
  styles: string;
}

export function extractStyles(html: string): StyleInfo[] {
  const styles: StyleInfo[] = [];
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Extract inline styles
  document.querySelectorAll("*[style]").forEach((element) => {
    styles.push({
      selector: generateSelector(element),
      styles: element.getAttribute("style") || "",
    });
  });

  // Extract styles from <style> tags
  document.querySelectorAll("style").forEach((styleTag) => {
    const cssText = styleTag.textContent || "";
    const parsedStyles = parseCSS(cssText);
    styles.push(...parsedStyles);
  });

  // Extract styles from <link> tags referencing CSS files
  document.querySelectorAll('link[rel="stylesheet"]').forEach((linkTag) => {
    const href = linkTag.getAttribute("href");
    if (href) {
      styles.push({
        selector: "@import",
        styles: `url(${href});`,
      });
    }
  });

  return styles;
}

function generateSelector(element: Element): string {
  let selector = element.tagName.toLowerCase();
  if (element.id) {
    selector += `#${element.id}`;
  }
  if (element.classList.length > 0) {
    selector += `.${Array.from(element.classList).join(".")}`;
  }
  return selector;
}

function parseCSS(cssText: string): StyleInfo[] {
  const styles: StyleInfo[] = [];
  const rules = cssText.split("}");

  rules.forEach((rule) => {
    const [selector, stylesText] = rule.split("{");
    if (selector && stylesText) {
      styles.push({
        selector: selector.trim(),
        styles: stylesText.trim(),
      });
    }
  });

  return styles;
}
