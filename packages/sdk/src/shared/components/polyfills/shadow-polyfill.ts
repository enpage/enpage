import { isBrowser } from "../utils/is-browser";

// Polyfill for Declarative Shadow DOM
if (isBrowser()) {
  if (!HTMLTemplateElement.prototype.hasOwnProperty("shadowRoot")) {
    document.querySelectorAll<HTMLTemplateElement>("template[shadowroot]").forEach((template) => {
      const mode = template.getAttribute("shadowroot");
      const shadowRoot = template.parentElement!.attachShadow({ mode: mode === "closed" ? "closed" : "open" });
      shadowRoot.appendChild(template.content);
      template.remove();
    });
  }
}
