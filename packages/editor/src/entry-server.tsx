import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline } from "@enpage/sdk/browser/twind";

export function render() {
  const html = inline(
    renderToString(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
  return { html };
}
