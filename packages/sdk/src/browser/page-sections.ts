/**
 * Retrieves all page sections from the document.
 * @param {Document} doc - The document to search for sections.
 */
export function getPageSections(doc: Document) {
  const sections = doc.querySelectorAll("body > section[ep-type='page']");
  return sections;
}
/**
 * Processes page sections, setting attributes and generating slugs.
 * @param {NodeListOf<Element>} sections - The list of section elements to process.
 */
export function processPageSections(sections: NodeListOf<Element>) {
  const slugs: string[] = [];
  sections.forEach((section, index) => {
    section.setAttribute("ep-label", `Page ${index + 1}`);
    if (!section.getAttribute("id")) {
      section.setAttribute("id", `page-${index + 1}`);
    }
    if (!section.getAttribute("ep-animate-appear")) {
      section.setAttribute("ep-animate-appear", "fadeIn");
    }
    if (!section.getAttribute("ep-animate-disappear")) {
      section.setAttribute("ep-animate-disappear", "fadeOut");
    }
    // add [ep-editable] if not present
    if (!section.getAttribute("ep-editable")) {
      section.setAttribute("ep-editable", "");
    }
    // hide all sections except the first one
    if (index > 0) {
      section.setAttribute("hidden", "");
      let slug = section.getAttribute("ep-slug");
      if (!slug) {
        slug = `page-${index + 1}`;
        section.setAttribute("ep-slug", slug);
      }
      slugs.push(slug);
    } else {
      // make sure the first section has role="main"
      section.setAttribute("role", "main");
      // make sure the first section has no slug
      section.removeAttribute("ep-slug");
      // hide it by default if it as an animation
      if (section.hasAttribute("ep-animate-appear")) {
        section.setAttribute("hidden", "");
      }
    }
  });
  return { slugs, pageCount: sections.length };
}
