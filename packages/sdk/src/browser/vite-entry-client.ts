import { EnpageJavascriptAPI } from "./js-api";
import { getPageSections, processPageSections } from "./page-sections";
const sections = getPageSections(document);
const { slugs } = processPageSections(sections);
console.debug("Loading Enpage Javascript API...");
window.enpage = new EnpageJavascriptAPI(window.__ENPAGE_STATE__, slugs);
