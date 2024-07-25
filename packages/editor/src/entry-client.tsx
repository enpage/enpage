import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

function base64ToBytes(base64: string) {
  const binString = atob(base64);
  // @ts-ignore
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

// @ts-ignore
const html = new TextDecoder().decode(base64ToBytes(window.__INITIAL_STATE__.templateContents));

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <App html={html} />
  </React.StrictMode>,
);
