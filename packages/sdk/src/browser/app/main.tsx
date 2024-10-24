import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import type { GenericPageConfig } from "~/shared/page-config.ts";
import { setupTwindReact } from "../twind";

// import "../twind";
setupTwindReact();

export default async function main() {
  // @ts-ignore
  const { default: ctx }: { default: GenericPageConfig } = await import("virtual:enpage-page-config.json");
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App config={ctx} />
    </StrictMode>,
  );
}

main();
