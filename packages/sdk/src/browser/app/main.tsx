import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./twind";

export default async function main() {
  // @ts-ignore
  const { default: ctx } = await import("virtual:enpage-page-config.json");
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App ctx={ctx} />
    </StrictMode>,
  );
}

main();
