import React from "react";
import { nanoid } from "nanoid";
import invariant from "tiny-invariant";
import type { CSSProperties } from "react";
import {
  CSSClassesReg,
  DynamicStylesArg,
  ResponsiveValue,
  CSSVarName,
  CSSVarRegistry,
  CSSVarValue,
} from "./types";

export class CSSRegistry {
  constructor(
    private varsReg: CSSVarRegistry = new Map(),
    private classesReg: CSSClassesReg = new Map(),
    private debugMode = true,
  ) {}

  public reset(varsReg: CSSVarRegistry, classesReg: CSSClassesReg): void {
    this.varsReg = varsReg;
    this.classesReg = classesReg;
  }

  // Method to add a new CSS variable scoped to a specific element
  public createVar(
    cssProp: keyof CSSProperties,
    globalValue?: CSSVarValue,
    debugName?: string,
  ): symbol {
    const key = Symbol(cssProp);
    const nano = nanoid(6);
    const name = this.debugMode ? debugName + "-" + nano : nano;

    this.varsReg.set(key, {
      name,
      cssProp,
      globalValue,
      localValues: new Map(),
    });

    return key;
  }

  registerClassProperty(
    className: string,
    cssProp: CSSVarName,
    cssVal: CSSVarValue,
  ) {
    const existingProps = this.classesReg.get(className) ?? new Map();
    existingProps.set(cssProp, cssVal);
    this.classesReg.set(className, existingProps);
  }

  dynamicStyles(styles: DynamicStylesArg) {
    const elementId = nanoid(6);
    const dynStyles = Object.getOwnPropertySymbols(styles).reduce(
      (acc, sym) => {
        const value = styles[sym];
        // @ts-ignore key is a symbol
        const varDesc = this.varsReg.get(sym);
        invariant(
          varDesc,
          "dynamicStyles(): CSS variable not found. Make sure to pass a valid key returned from createVar().",
        );
        const val = value as ResponsiveValue<CSSVarValue> | undefined | null;

        // we are dealing with a responsive value, which needs media queries
        // so we we need to generate a unique var name for each breakpoint
        if (typeof val === "object" && val !== null) {
          for (const [breakpoint, value] of Object.entries(val)) {
            const cls = `${breakpoint}-${elementId}`;
            this.registerClassProperty(cls, varDesc.cssProp, value);
          }
          return {};
        } else if (typeof val === "string" || typeof val === "number") {
          // simple value, no media queries needed
          acc[varDesc.cssProp] = `${val}`;
        }

        return acc;
      },
      {} as Record<string, string>,
    );
    return dynStyles;
  }

  // assign(
  //   key: symbol,
  //   value: VarValue | ResponsiveValue,
  //   element: HTMLElement | ElementId,
  // ): void {
  //   const id = element instanceof HTMLElement ? element.id : element;
  //   invariant(!!id, "assignVar(): Element ID is required.");

  //   const varDesc = this.varsReg.get(key);
  //   invariant(
  //     varDesc,
  //     "assignVar(): CSS variable not found. Make sure to pass a valid key returned from createVar().",
  //   );

  //   varDesc.localValues.set(id, value);
  // }

  // todo fix this
  getRootVars(): string {
    return Array.from(this.varsReg.values())
      .map((desc) => {
        const value = desc.globalValue;
        return `--${desc.name}: ${value};`;
      })
      .join("\n");
  }

  // getElementVars(id: ElementId): string {
  //   return Array.from(this.varsReg.values())
  //     .map((desc) => {
  //       const value = desc.localValues.get(id);
  //       if (typeof value !== "object" && value !== "") {
  //         return `--${desc.name}: ${value};`;
  //       }
  //       return "";
  //     })
  //     .join("\n");
  // }

  getClasses(): string {
    return Array.from(this.classesReg.entries())
      .map(([className, props]) => {
        console.log(className, props);
        const cssProps = Array.from(props.entries())
          .map(([prop, value]) => `${prop}: ${value};`)
          .join("\n");
        return `.${className} { ${cssProps} }`;
      })
      .join("\n");
  }
}

export const registry = new CSSRegistry();
export const createVar = registry.createVar.bind(registry);
// export const assignVar = registry.assign.bind(registry);
// export const getRootVars = registry.getRootVars.bind(registry);
// export const getClasses = registry.getClasses.bind(registry);
export const dynamicStyles = registry.dynamicStyles.bind(registry);

export function DynamicCSS() {
  return (
    <style>
      {`
        :root {
          ${registry.getRootVars()}
        }
        ${registry.getClasses()}
      `}
    </style>
  );
}
