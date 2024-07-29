// augment window object with custom properties
declare global {
  interface Window {
    enpage: import("./src/browser/js-api").EnpageJavascriptAPI;
  }
}

export type {};
