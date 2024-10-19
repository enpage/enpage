import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const hydrate = () =>
  startTransition(() => {
    hydrateRoot(
      document.getElementById("root") as HTMLElement,
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
