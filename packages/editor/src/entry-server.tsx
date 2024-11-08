import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline, tw } from "@enpage/style-system/twind";

export function render() {
  const html = inline(
    renderToString(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
    tw,
  );
  return { html };
}
