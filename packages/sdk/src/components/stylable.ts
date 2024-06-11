import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// Define valid breakpoints
type Breakpoints = "mobile" | "tablet" | "desktop";

// Define a type for responsive styles that accept only valid CSS properties and specific breakpoints
type ResponsiveStyles = {
  [key in Breakpoints]?: Partial<CSSStyleDeclaration>;
};

// Define a type for CSS variables, allowing for both responsive and non-responsive values
type CSSVariables = {
  [key in Breakpoints]?: Partial<Record<string, string>>;
} & Partial<Record<string, string>>;

@customElement("ep-stylable")
class EnpageStylable extends LitElement {
  @property({ type: Object }) cssvars: CSSVariables = {};
  @property({ type: Object }) responsiveStyles: ResponsiveStyles = {};

  static styles = css`
    :host {
      display: block;
    }
  `;

  static get observedAttributes() {
    return ["class", "style", "cssvars", "responsive-styles"];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.renderTargetComponents();
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has("cssvars") ||
      changedProperties.has("class") ||
      changedProperties.has("style") ||
      changedProperties.has("responsiveStyles")
    ) {
      this.renderTargetComponents();
    }
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, styles);
  }

  private generateResponsiveCSS() {
    const responsiveStyles = this.responsiveStyles;
    const cssvars = this.cssvars;
    const cssRules = [];

    const breakpoints = {
      mobile: "@media (max-width: 600px)",
      tablet: "@media (min-width: 601px) and (max-width: 1024px)",
      desktop: "@media (min-width: 1025px)",
    };

    const generateCSSFromObject = (obj: object, prefix: string = ""): string => {
      return Object.entries(obj)
        .map(([key, value]) => `${prefix}${key}: ${value};`)
        .join(" ");
    };

    for (const [breakpoint, styles] of Object.entries(responsiveStyles)) {
      if (breakpoints[breakpoint as Breakpoints]) {
        cssRules.push(`${breakpoints[breakpoint as Breakpoints]} { ${generateCSSFromObject(styles)} }`);
      }
    }

    // Separate responsive and non-responsive CSS variables
    const nonResponsiveCSSVars = Object.entries(cssvars).filter(
      ([key]) => !["mobile", "tablet", "desktop"].includes(key),
    );

    if (nonResponsiveCSSVars.length > 0) {
      cssRules.push(generateCSSFromObject(Object.fromEntries(nonResponsiveCSSVars), "--"));
    }

    for (const [breakpoint, variables] of Object.entries(cssvars)) {
      if (breakpoints[breakpoint as Breakpoints] && variables) {
        cssRules.push(
          `${breakpoints[breakpoint as Breakpoints]} { ${generateCSSFromObject(variables as object, "--")} }`,
        );
      }
    }

    return cssRules.join(" ");
  }

  private renderTargetComponents() {
    const shadowRoot = this.shadowRoot!;
    shadowRoot.innerHTML = ""; // Clear the shadow root

    const children = Array.from(this.children);
    if (children.length === 0) return;

    children.forEach((child) => {
      const targetComponent = child.cloneNode(true) as HTMLElement;

      // Apply custom classes from the class attribute
      const customClasses = this.getAttribute("class");
      if (customClasses) {
        targetComponent.className = customClasses;
      }

      // Apply inline styles from the style attribute
      const customStyles = this.getAttribute("style");
      if (customStyles) {
        try {
          const styles: Partial<CSSStyleDeclaration> = JSON.parse(customStyles);
          this.applyStyles(targetComponent, styles);
        } catch {
          this.applyStyles(targetComponent, customStyles);
        }
      }

      // Append the target component to the shadow DOM
      shadowRoot.appendChild(targetComponent);
    });

    // Generate and inject responsive CSS
    const responsiveCSS = this.generateResponsiveCSS();
    if (responsiveCSS) {
      const styleElement = document.createElement("style");
      styleElement.textContent = responsiveCSS;
      document.head.appendChild(styleElement);
    }

    // Example usage of the global library
    // window.myLibrary.logMessage('Target components rendered');
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ep-stylable": EnpageStylable;
  }
}
