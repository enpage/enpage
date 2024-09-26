import { JSDOM, VirtualConsole } from "jsdom";

export function createJSDOM(html: string) {
  const virtualConsole = new VirtualConsole();

  // disable JSDOM errors otherwise we'll get a lot of noise
  // for things like CSS imports or other new CSS features
  // not recognized by JSDOM
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const dom = new JSDOM(html, { virtualConsole });
  const doc = dom.window.document;
  const head = doc.querySelector("head");
  const body = doc.querySelector("body");
  return { head, doc, body, dom };
}
