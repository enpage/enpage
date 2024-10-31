import install from "@twind/with-react";
import {
  twind,
  virtual,
  cssom,
  tx as tx$,
  css as css$,
  style as style$,
  apply as apply$,
  injectGlobal as injectGlobal$,
  keyframes as keyframes$,
  observe as observe$,
} from "@twind/core";
import config from "./twind.config";

export { getSheet } from "@twind/core";
export { default as inline } from "@twind/with-react/inline";

// const colors = config.theme.colors ?? {};

// export const backgroundClasses = Object.entries(colors).flatMap(([color, shades]) => {
//   return Array.isArray(shades) ? shades.map((shade: string) => `bg-${color}-${shade}`) : `bg-${color}`;
// });

export const colors = Object.keys(config.theme.colors ?? {}).filter(
  (color) =>
    ["inherit", "current", "transparent", "neutral", "zinc", "black", "white"].includes(color) === false,
);

function isProd() {
  if (typeof import.meta.env !== "undefined") {
    return import.meta.env.PROD ?? false;
  } else if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env.NODE_ENV === "production";
  }
  return true;
}

// export default install(config, isProd());

export const sheet = typeof document === "undefined" ? virtual() : cssom("style[data-library]");

// @ts-ignore
export const tw = /* #__PURE__ */ twind(
  config,
  // support SSR and use a different selector to not get the twind default style sheet
  sheet,
);

export function setupTwindReact() {
  install(config, isProd());

  addEventListener("warning", (event) => {
    // @ts-ignore
    const warning = event.detail as { message: string; code: string; detail: string };
    if (warning.code === "TWIND_INVALID_CLASS") {
      event.preventDefault();
    }
  });
}

export const tx = /* #__PURE__ */ tx$.bind(tw);
export const css = /* #__PURE__ */ css$.bind(tw);
export const style = /* #__PURE__ */ style$.bind(tw);
export const apply = /* #__PURE__ */ apply$.bind(tw);
export const observe = /* #__PURE__ */ observe$.bind(tw);
export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw);
export const keyframes = /* #__PURE__ */ keyframes$.bind(tw);
