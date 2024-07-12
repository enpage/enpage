import { isBrowser } from "./is-browser";
import { JSDOM } from "jsdom";

export function getGlobalAndDocument(): { global: any; document: Document } {
  if (isBrowser()) {
    return { global: window, document: document };
  } else {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    return { global: dom.window, document: dom.window.document };
  }
}
