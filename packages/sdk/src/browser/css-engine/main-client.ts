/**
 * CSS Processing Utility Functions
 *
 * This module provides utility functions for detecting changes in CSS and
 * processing them using a Web Worker.
 *
 * @example
 * ```typescript
 * import { CSSProcessor } from './css-processor';
 * import { CSSManager } from './css-manager';
 * import { getChange, debounce, getAllPageCSS } from './main';
 *
 * const processor = new CSSProcessor();
 * const cssManager = new CSSManager();
 *
 * // Function to initialize CSS processing
 * async function initializeCSSProcessing() {
 *   const initialCSS = getAllPageCSS();
 *   await processor.initialize(initialCSS, {
 *     // Any global style overrides
 *   });
 *   console.log('CSS Processor initialized with all page CSS');
 * }
 *
 * // Function to handle CSS changes
 * async function handleCSSChange(mutation: MutationRecord) {
 *   if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
 *     const target = mutation.target as HTMLElement;
 *     const oldCSS = target.getAttribute('data-previous-style') || '';
 *     const newCSS = target.style.cssText;
 *
 *     const change = getChange(oldCSS, newCSS);
 *     if (change) {
 *       try {
 *         const result = await processor.processChange(change, {
 *           // Any relevant style overrides
 *         });
 *
 *         // Apply processed changes
 *         for (const [selector, cssText] of Object.entries(result.changes)) {
 *           cssManager.updateRule(selector, cssText);
 *         }
 *
 *         if (result.warnings.length > 0) {
 *           console.warn('CSS processing warnings:', result.warnings);
 *         }
 *
 *         // Update the previous style data attribute
 *         target.setAttribute('data-previous-style', newCSS);
 *       } catch (error) {
 *         console.error('CSS processing error:', error);
 *       }
 *     }
 *   }
 * }
 *
 * // Set up MutationObserver to watch for style changes
 * const observer = new MutationObserver(debounce((mutations: MutationRecord[]) => {
 *   for (const mutation of mutations) {
 *     handleCSSChange(mutation);
 *   }
 * }, 100));
 *
 * // Start observing the entire document for style attribute changes
 * observer.observe(document.documentElement, {
 *   attributes: true,
 *   attributeFilter: ['style'],
 *   subtree: true
 * });
 *
 * // Initialize CSS processing when the page loads
 * window.addEventListener('load', initializeCSSProcessing);
 * ```
 */

/**
 * Represents a change in CSS.
 */
export interface Change {
  type: string;
  selector: string;
  property?: string;
  value?: string;
  parent?: string;
}

/**
 * Retrieves all CSS from the current page, including stylesheets and inline styles.
 * @returns A string containing all CSS on the page
 */
export function getAllPageCSS(): string {
  let css = "";

  // Get CSS from stylesheets
  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      for (const rule of rules) {
        css += rule.cssText + "\n";
      }
    } catch (e) {
      console.warn("Cannot access stylesheet", sheet, e);
    }
  }

  // Get inline styles
  const elements = document.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>;
  for (const el of elements) {
    if (el.style.cssText) {
      css += `${el.tagName.toLowerCase()} { ${el.style.cssText} }\n`;
    }
  }

  return css;
}

/**
 * Detects changes between two CSS strings.
 * @param oldCSS - The original CSS string
 * @param newCSS - The new CSS string
 * @returns A Change object representing the first detected change, or null if no changes
 */
export function getChange(oldCSS: string, newCSS: string): Change | null {
  const oldAst = parseCSS(oldCSS);
  const newAst = parseCSS(newCSS);

  const changes = diffAST(oldAst, newAst);

  if (changes.length === 0) {
    return null;
  }

  return changes[0];
}

interface CSSRule {
  selector: string;
  properties: { property: string; value: string }[];
  parent: string | null;
}

interface CSSAST {
  rules: CSSRule[];
}

function parseCSS(css: string): CSSAST {
  const ast: CSSAST = { rules: [] };
  const lines = css.split("\n");
  let currentRule: CSSRule | null = null;
  let currentMedia: string | null = null;

  for (const line of lines) {
    if (line.trim().startsWith("@media")) {
      currentMedia = line.trim();
    } else if (line.includes("{")) {
      currentRule = { selector: line.split("{")[0].trim(), properties: [], parent: currentMedia };
      ast.rules.push(currentRule);
    } else if (line.includes("}")) {
      currentRule = null;
      if (currentMedia) {
        currentMedia = null;
      }
    } else if (currentRule && line.includes(":")) {
      const [property, value] = line.split(":").map((s) => s.trim());
      currentRule.properties.push({ property, value: value.replace(";", "") });
    }
  }

  return ast;
}

function diffAST(oldAst: any, newAst: any): Change[] {
  const changes: Change[] = [];

  for (const newRule of newAst.rules) {
    const oldRule = oldAst.rules.find((r: any) => r.selector === newRule.selector && r.parent === newRule.parent);

    if (!oldRule) {
      changes.push({
        type: "ruleAdded",
        selector: newRule.selector,
        parent: newRule.parent,
      });
    } else {
      for (const newProp of newRule.properties) {
        const oldProp = oldRule.properties.find((p: any) => p.property === newProp.property);
        if (!oldProp) {
          changes.push({
            type: "propertyAdded",
            selector: newRule.selector,
            property: newProp.property,
            value: newProp.value,
            parent: newRule.parent,
          });
        } else if (oldProp.value !== newProp.value) {
          changes.push({
            type: "propertyChanged",
            selector: newRule.selector,
            property: newProp.property,
            value: newProp.value,
            parent: newRule.parent,
          });
        }
      }
    }
  }

  // Check for removed rules and properties
  for (const oldRule of oldAst.rules) {
    const newRule = newAst.rules.find((r: any) => r.selector === oldRule.selector && r.parent === oldRule.parent);
    if (!newRule) {
      changes.push({
        type: "ruleRemoved",
        selector: oldRule.selector,
        parent: oldRule.parent,
      });
    } else {
      for (const oldProp of oldRule.properties) {
        if (!newRule.properties.find((p: any) => p.property === oldProp.property)) {
          changes.push({
            type: "propertyRemoved",
            selector: oldRule.selector,
            property: oldProp.property,
            parent: oldRule.parent,
          });
        }
      }
    }
  }

  return changes;
}
