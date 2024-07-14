export class CSSManager {
  private styleElement: HTMLStyleElement;
  private styleSheet: CSSStyleSheet;
  private ruleIndex: Map<string, number>;

  constructor() {
    this.styleElement = document.createElement("style");
    document.head.appendChild(this.styleElement);
    this.styleSheet = this.styleElement.sheet as CSSStyleSheet;
    this.ruleIndex = new Map();
  }

  public updateRule(selector: string, cssText: string): void {
    if (this.ruleIndex.has(selector)) {
      const index = this.ruleIndex.get(selector)!;
      this.styleSheet.deleteRule(index);
      this.styleSheet.insertRule(`${selector} { ${cssText} }`, index);
    } else {
      const index = this.styleSheet.cssRules.length;
      this.styleSheet.insertRule(`${selector} { ${cssText} }`, index);
      this.ruleIndex.set(selector, index);
    }
  }
}
