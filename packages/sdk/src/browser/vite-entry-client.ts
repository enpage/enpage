import { EnpageJavascriptAPI } from "./js-api";
console.debug("Loading Enpage Javascript API...");
window.enpage = new EnpageJavascriptAPI(window.__ENPAGE_STATE__, []);
