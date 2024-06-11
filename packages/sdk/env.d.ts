// augment window object with custom properties
declare global {
  interface Window {
    _enpageCtx: import("./src/context").EnpageContext;
    enpage: import("./src/sdk").EnpageSDK;
  }
}

export {};
