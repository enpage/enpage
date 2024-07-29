// augment window object with custom properties
declare global {
  interface Window {
    enpage: import("./src/browser/js-api").EnpageJavascriptAPI;
    __ENPAGE_STATE__: ConstructorParameters<typeof import("./src/browser/js-api").EnpageJavascriptAPI>;
  }
}

export type {};
