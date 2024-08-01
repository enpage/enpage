import { EnpageJavascriptAPI } from "./js-api";
if (window.__ENPAGE_STATE__) {
  console.debug("Loading Enpage Javascript API...");
  window.enpage = new EnpageJavascriptAPI(...window.__ENPAGE_STATE__);
}
