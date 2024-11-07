import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import type { GenericPageConfig } from "~/shared/page.ts";
import { setupTwindReact } from "../twind";

setupTwindReact();

export default async function main() {
  // @ts-ignore
  const { default: ctx }: { default: GenericPageConfig } = await import("virtual:enpage-page-config.json");
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App pageConfig={ctx} pages={[]} />
    </StrictMode>,
  );
}

main();
