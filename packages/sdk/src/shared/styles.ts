// @enpage/sdk/styles.ts
import type { Config } from "tailwindcss";
type TailwindTheme = Config["theme"];

type StyleType =
  | "color"
  | "font"
  | "size"
  | "spacing"
  | "border"
  | "shadow"
  | "gradient"
  | "transform"
  | "transition"
  | "layout"
  | "component";

interface StyleDefinition<T> {
  type: StyleType;
  label: string;
  defaultValue: T;
}

interface ColorStyle extends StyleDefinition<string> {
  type: "color";
}

interface FontStyle extends StyleDefinition<string> {
  type: "font";
}

interface SizeStyle extends StyleDefinition<string> {
  type: "size";
}

interface SpacingStyle extends StyleDefinition<string> {
  type: "spacing";
}

interface BorderStyle
  extends StyleDefinition<{
    width: string;
    style: string;
    color: string;
  }> {
  type: "border";
}

interface ShadowStyle extends StyleDefinition<string> {
  type: "shadow";
}

interface GradientStyle
  extends StyleDefinition<{
    type: "linear" | "radial";
    stops: Array<{ color: string; position: string }>;
  }> {
  type: "gradient";
}

interface TransformStyle extends StyleDefinition<string> {
  type: "transform";
}

interface TransitionStyle
  extends StyleDefinition<{
    property: string;
    duration: string;
    timingFunction: string;
    delay: string;
  }> {
  type: "transition";
}

interface LayoutStyle
  extends StyleDefinition<{
    display: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridTemplateAreas?: string;
    gridColumnGap?: string;
    gridRowGap?: string;
    gridColumn?: string;
    gridRow?: string;
    gridArea?: string;
  }> {
  type: "layout";
}

interface ComponentStyle extends StyleDefinition<Record<string, string>> {
  type: "component";
}

type Style =
  | ColorStyle
  | FontStyle
  | SizeStyle
  | SpacingStyle
  | BorderStyle
  | ShadowStyle
  | GradientStyle
  | TransformStyle
  | TransitionStyle
  | LayoutStyle
  | ComponentStyle;

type Styles = {
  [key: string]: Style | Styles;
};

const createStyle = <T extends Style>(type: StyleType, label: string, defaultValue: T["defaultValue"]): T => {
  return {
    type,
    label,
    defaultValue,
  } as T;
};

export const style = {
  color: (label: string, defaultValue: string): ColorStyle => createStyle("color", label, defaultValue),
  font: (label: string, defaultValue: string): FontStyle => createStyle("font", label, defaultValue),
  size: (label: string, defaultValue: string): SizeStyle => createStyle("size", label, defaultValue),
  spacing: (label: string, defaultValue: string): SpacingStyle => createStyle("spacing", label, defaultValue),
  border: (label: string, defaultValue: BorderStyle["defaultValue"]): BorderStyle =>
    createStyle("border", label, defaultValue),
  shadow: (label: string, defaultValue: string): ShadowStyle => createStyle("shadow", label, defaultValue),
  gradient: (label: string, defaultValue: GradientStyle["defaultValue"]): GradientStyle =>
    createStyle("gradient", label, defaultValue),
  transform: (label: string, defaultValue: string): TransformStyle => createStyle("transform", label, defaultValue),
  transition: (label: string, defaultValue: TransitionStyle["defaultValue"]): TransitionStyle =>
    createStyle("transition", label, defaultValue),
  layout: (label: string, defaultValue: LayoutStyle["defaultValue"]): LayoutStyle =>
    createStyle("layout", label, defaultValue),
  component: (label: string, defaultValue: Record<string, string>): ComponentStyle =>
    createStyle("component", label, defaultValue),
};

export const defineStyles = (styles: Styles): Styles => {
  return styles;
};

export const generateCSSVariables = (styles: Styles, prefix = "--"): string => {
  let css = "";

  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === "object" && "type" in value) {
      const style = value as Style;
      const varName = `${prefix}${key}`;

      switch (style.type) {
        case "color":
        case "font":
        case "size":
        case "spacing":
        case "shadow":
        case "transform":
          css += `${varName}: var(--enpage-${varName}, ${style.defaultValue});\n`;
          break;
        case "border":
          css += `${varName}-width: var(--enpage-${varName}-width, ${style.defaultValue.width});\n`;
          css += `${varName}-style: var(--enpage-${varName}-style, ${style.defaultValue.style});\n`;
          css += `${varName}-color: var(--enpage-${varName}-color, ${style.defaultValue.color});\n`;
          break;
        case "gradient":
          const gradientString =
            style.defaultValue.type === "linear"
              ? `linear-gradient(${style.defaultValue.stops.map((stop) => `${stop.color} ${stop.position}`).join(", ")})`
              : `radial-gradient(${style.defaultValue.stops.map((stop) => `${stop.color} ${stop.position}`).join(", ")})`;
          css += `${varName}: var(--enpage-${varName}, ${gradientString});\n`;
          break;
        case "transition":
          css += `${varName}: var(--enpage-${varName}, ${style.defaultValue.property} ${style.defaultValue.duration} ${style.defaultValue.timingFunction} ${style.defaultValue.delay});\n`;
          break;
        case "layout":
          for (const [layoutKey, layoutValue] of Object.entries(style.defaultValue)) {
            css += `${varName}-${layoutKey}: var(--enpage-${varName}-${layoutKey}, ${layoutValue});\n`;
          }
          break;
        case "component":
          css += `[enpage-style~="${key}"] {\n`;
          for (const [propKey, propValue] of Object.entries(style.defaultValue)) {
            const cssKey = propKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            css += `  ${cssKey}: var(--enpage-${varName}-${propKey}, ${propValue}) !important;\n`;
          }
          css += "}\n";
          break;
      }
    } else if (typeof value === "object") {
      css += generateCSSVariables(value as Styles, `${prefix}${key}-`);
    }
  }

  return css;
};

export const generateTailwindTheme = (styles: Styles): Partial<TailwindTheme> => {
  const theme: Partial<TailwindTheme> = {};

  const processStyles = (styleObj: Styles, themeObj: Partial<TailwindTheme> = theme) => {
    for (const [key, value] of Object.entries(styleObj)) {
      if (typeof value === "object" && "type" in value) {
        const style = value as Style;

        switch (style.type) {
          case "color":
            if (!themeObj.colors) themeObj.colors = {};
            (themeObj.colors as Record<string, string>)[key] = `var(--${key})`;
            break;
          case "font":
            if (!themeObj.fontFamily) themeObj.fontFamily = {};
            (themeObj.fontFamily as Record<string, string>)[key] = `var(--${key})`;
            break;
          case "size":
            if (!themeObj.fontSize) themeObj.fontSize = {};
            (themeObj.fontSize as Record<string, string>)[key] = `var(--${key})`;
            break;
          case "spacing":
            if (!themeObj.spacing) themeObj.spacing = {};
            (themeObj.spacing as Record<string, string>)[key] = `var(--${key})`;
            break;
          case "shadow":
            if (!themeObj.boxShadow) themeObj.boxShadow = {};
            (themeObj.boxShadow as Record<string, string>)[key] = `var(--${key})`;
            break;
          case "border":
            if (!themeObj.borderWidth) themeObj.borderWidth = {};
            (themeObj.borderWidth as Record<string, string>)[key] = `var(--${key}-width)`;
            if (!themeObj.borderColor) themeObj.borderColor = {};
            (themeObj.borderColor as Record<string, string>)[key] = `var(--${key}-color)`;
            if (!themeObj.borderStyle) themeObj.borderStyle = {};
            (themeObj.borderStyle as Record<string, string>)[key] = `var(--${key}-style)`;
            break;
          case "gradient":
            // Gradients are typically handled via utilities in Tailwind, not in the theme
            break;
          case "transform":
            // Transforms are typically handled via utilities in Tailwind, not in the theme
            break;
          case "transition":
            if (!themeObj.transitionProperty) themeObj.transitionProperty = {};
            (themeObj.transitionProperty as Record<string, string>)[key] = `var(--${key}-property)`;
            if (!themeObj.transitionDuration) themeObj.transitionDuration = {};
            (themeObj.transitionDuration as Record<string, string>)[key] = `var(--${key}-duration)`;
            if (!themeObj.transitionTimingFunction) themeObj.transitionTimingFunction = {};
            (themeObj.transitionTimingFunction as Record<string, string>)[key] = `var(--${key}-timingFunction)`;
            if (!themeObj.transitionDelay) themeObj.transitionDelay = {};
            (themeObj.transitionDelay as Record<string, string>)[key] = `var(--${key}-delay)`;
            break;
          case "layout":
            // Most layout properties are handled via utilities in Tailwind, not in the theme
            if (style.defaultValue.display) {
              if (!themeObj.display) themeObj.display = {};
              (themeObj.display as Record<string, string>)[key] = style.defaultValue.display;
            }
            // You might want to handle other layout properties here if they map to Tailwind theme options
            break;
          case "component":
            // Component styles don't directly map to Tailwind theme
            // You might want to create custom utilities for these
            break;
        }
      } else if (typeof value === "object") {
        (themeObj as any)[key] = {};
        processStyles(value as Styles, (themeObj as any)[key]);
      }
    }
  };

  processStyles(styles);
  return theme;
};

export class StyleManager {
  private styles: Styles;

  constructor(styles: Styles) {
    this.styles = styles;
  }

  updateStyle(path: string[], value: any) {
    let current: any = this.styles;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    const lastKey = path[path.length - 1];
    if (current[lastKey] && "defaultValue" in current[lastKey]) {
      current[lastKey].defaultValue = value;
    }

    // Update the CSS custom property
    const propertyName = `--${path.join("-")}`;
    if (typeof value === "object") {
      for (const [key, val] of Object.entries(value)) {
        document.documentElement.style.setProperty(`${propertyName}-${key}`, val as string);
      }
    } else {
      document.documentElement.style.setProperty(propertyName, value);
    }
  }

  getStyleValue(path: string[]): any {
    let current: any = this.styles;
    for (const key of path) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }
    return "defaultValue" in current ? current.defaultValue : undefined;
  }

  applyStyles() {
    const css = generateCSSVariables(this.styles);
    const styleElement = document.createElement("style");
    styleElement.textContent = `:root { ${css} }`;
    document.head.appendChild(styleElement);
  }

  getComputedElementStyles(element: HTMLElement): Record<string, any> {
    const computedStyle = window.getComputedStyle(element);
    const styles: Record<string, any> = {};

    const processStyle = (styleObj: Style | Styles, prefix = "") => {
      for (const [key, value] of Object.entries(styleObj)) {
        if (typeof value === "object" && "type" in value) {
          const style = value as Style;
          const fullKey = prefix ? `${prefix}-${key}` : key;

          switch (style.type) {
            case "color":
            case "font":
            case "size":
            case "spacing":
            case "shadow":
            case "transform":
              styles[fullKey] = computedStyle.getPropertyValue(`--${fullKey}`);
              break;
            case "border":
              styles[fullKey] = {
                width: computedStyle.getPropertyValue(`--${fullKey}-width`),
                style: computedStyle.getPropertyValue(`--${fullKey}-style`),
                color: computedStyle.getPropertyValue(`--${fullKey}-color`),
              };
              break;
            case "gradient":
              styles[fullKey] = computedStyle.getPropertyValue(`--${fullKey}`);
              break;
            case "transition":
              styles[fullKey] = computedStyle.getPropertyValue(`--${fullKey}`);
              break;
            case "layout":
              styles[fullKey] = {};
              for (const layoutKey in (style as LayoutStyle).defaultValue) {
                styles[fullKey][layoutKey] = computedStyle.getPropertyValue(`--${fullKey}-${layoutKey}`);
              }
              break;
            case "component":
              styles[fullKey] = {};
              for (const propKey in (style as ComponentStyle).defaultValue) {
                const cssKey = propKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
                styles[fullKey][propKey] = computedStyle.getPropertyValue(cssKey);
              }
              break;
          }
        } else if (typeof value === "object") {
          processStyle(value as Styles, prefix ? `${prefix}-${key}` : key);
        }
      }
    };

    processStyle(this.styles);
    return styles;
  }

  saveCustomStyles(elementId: string, styles: Record<string, any>) {
    // This method would typically involve sending the styles to a server
    console.log(`Saving custom styles for element ${elementId}:`, styles);
    // In a real implementation, you'd send these styles to your server
    // fetch('/api/save-styles', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ elementId, styles }),
    // });
  }

  loadCustomStyles(): Record<string, Record<string, any>> {
    // This method would typically involve fetching styles from a server
    console.log("Loading custom styles");
    return {};
    // In a real implementation, you'd fetch these styles from your server
    // return fetch('/api/load-styles').then(res => res.json());
  }
}
