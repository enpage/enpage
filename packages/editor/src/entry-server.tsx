import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import type { Request } from "express";

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(binString);
}

const ERROR_CONTENTS = `<!DOCTYPE html><html><head><style>
  body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}</style></head><body>Cannot load template</body></html>`;

export async function render(req: Request) {
  let contents = ERROR_CONTENTS;

  // fetch contents from templateUrl query param
  try {
    const templateUrl = new URL(req.query.templateUrl as string);
    contents = await fetch(templateUrl.toString()).then((res) => res.text());
  } catch (e) {
    contents = ERROR_CONTENTS;
  }
  // render the app
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App html={contents} />
    </React.StrictMode>,
  );
  return {
    html,
    state: JSON.stringify({ templateContents: bytesToBase64(new TextEncoder().encode(contents)) }),
  };
}
