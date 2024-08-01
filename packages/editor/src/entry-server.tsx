import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import type { Request } from "express";

const IFRAME_MODE: "url" | "srcdoc" = "srcdoc";

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(binString);
}

const ERROR_CONTENTS = `<!DOCTYPE html><html><head><style>
  body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}</style></head><body>Cannot load template</body></html>`;

export async function render(req: Request) {
  if (!req.query.templateUrl) {
    throw new Error("templateUrl query param is required");
  }
  let contents: string | undefined;
  const templateUrl = new URL(req.query.templateUrl as string);

  if (templateUrl.hostname !== "localhost") {
    throw new Error("Invalid templateUrl. Only localhost is allowed");
  }

  // fetch contents from templateUrl query param
  try {
    if (IFRAME_MODE === "srcdoc") {
      contents = await fetch(templateUrl.href).then((res) => res.text());
    }
  } catch (e) {
    contents = ERROR_CONTENTS;
  }
  // render the app
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App html={contents} templateUrl={templateUrl.href} />
    </React.StrictMode>,
  );
  return {
    html,
    state: JSON.stringify({
      templateContents: bytesToBase64(new TextEncoder().encode(contents)),
      templateUrl,
    }),
  };
}
