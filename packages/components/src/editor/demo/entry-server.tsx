import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline, tw } from "@enpage/style-system/twind";

export function render() {
  return inline(
    renderToString(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
    tw,
  );
}
