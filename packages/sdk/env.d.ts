// augment window object with custom properties
declare global {
  interface Window {
    _enpageCtx: import("@enpage/types/context").PageContext<any, any>;
    enpage: import("./src/sdk").EnpageSDK;
  }
}

export {};
