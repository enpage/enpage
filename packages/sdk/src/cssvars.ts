import { nanoid } from "nanoid";
import invariant from "tiny-invariant";

type VarName = string;

type VarDescriptor = {
  key: symbol;
  toString(): string;
};

type VarValue = string | number;

type VarRegistry = Map<symbol, VarName>;

type ResponsiveValue = {
  mobile?: VarValue;
  tablet?: VarValue;
  desktop?: VarValue;
  mobileOnly?: VarValue;
  tabletOnly?: VarValue;
  desktopOnly?: VarValue;
  maxMobile?: VarValue;
  maxTablet?: VarValue;
};

// type ClassesReg = Map<string, string>;
// type ElementId = string;

// class CSSRegistry {
//   constructor(
//     private varsReg: VarRegistry = new Map(),
//     private classesReg: ClassesReg = new Map(),
//     private debugMode = true,
//   ) {}

//   public reset(varsReg: VarRegistry, classesReg: ClassesReg): void {
//     this.varsReg = varsReg;
//     this.classesReg = classesReg;
//   }

//   // Method to add a new CSS variable scoped to a specific element
//   public createVar(globalValue?: VarValue, debugName?: string): symbol {
//     const key = Symbol();
//     const nano = nanoid(6);
//     const name = this.debugMode ? debugName + "-" + nano : nano;

//     this.varsReg.set(key, {
//       name,
//       globalValue,
//       localValues: new Map(),
//     });

//     return key;
//   }
//   assignVar(
//     key: symbol,
//     value: VarValue | ResponsiveValue,
//     element: HTMLElement | ElementId,
//   ): void {
//     const id = element instanceof HTMLElement ? element.id : element;
//     invariant(!!id, "assignVar(): Element ID is required.");

//     const varDesc = this.varsReg.get(key);
//     invariant(
//       varDesc,
//       "assignVar(): CSS variable not found. Make sure to pass a valid key returned from createVar().",
//     );

//     varDesc.localValues.set(id, value);
//   }
// }

// const registry = new CSSRegistry();

// export const reset = (map: VarRegistry) => registry.reset(map);

const registry: VarRegistry = new Map();

export function cssVar(debugName?: string): VarDescriptor {
  const key = Symbol();
  const nano = nanoid(6);
  const name = debugName ? debugName + "-" + nano : nano;
  registry.set(key, name);

  return {
    key,
    toString() {
      return `--${name}`;
    },
  };
}

export function cssVal() {}
