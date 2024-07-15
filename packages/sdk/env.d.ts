// augment window object with custom properties
declare global {
  interface Window {
    _enpageCtx: import("./src/shared/context").SiteContext<any, any>;
    enpage: import("./src/browser/js-api").EnpageJavascriptAPI;
  }
}

export {};
