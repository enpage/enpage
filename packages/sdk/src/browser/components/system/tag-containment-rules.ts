// tag-containment-rules.ts

// all valid HTML tags
type Tag = keyof HTMLElementTagNameMap | "svg";

// Define a type for the rules
type ContainmentRules = {
  [key in Tag]?: Tag[];
};

// Helper function to create sets of tags
const createSet = (...tags: Tag[]): Tag[] => tags;

// Sets of related tags for easier rule definition
const flowContent = createSet(
  "div",
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "table",
  "form",
  "article",
  "section",
  "nav",
  "aside",
  "header",
  "footer",
  "figure",
  "details",
  "blockquote",
  "address",
  "pre",
  "video",
  "audio",
  "canvas",
  "iframe",
);
const inlineContent = createSet(
  "span",
  "a",
  "img",
  "button",
  "input",
  "label",
  "time",
  "mark",
  "q",
  "code",
  "kbd",
  "samp",
  "var",
  "cite",
  "abbr",
  "svg",
);
const headingContent = createSet("h1", "h2", "h3", "h4", "h5", "h6");

// Define the actual rules
export const tagContainmentRules: ContainmentRules = {
  div: [...flowContent, ...inlineContent],
  p: inlineContent,
  span: inlineContent,
  a: inlineContent.filter((tag) => tag !== "a"), // 'a' cannot contain another 'a'
  button: inlineContent,
  h1: inlineContent,
  h2: inlineContent,
  h3: inlineContent,
  h4: inlineContent,
  h5: inlineContent,
  h6: inlineContent,
  ul: ["li"],
  ol: ["li"],
  li: [...flowContent, ...inlineContent],
  table: ["caption", "colgroup", "thead", "tbody", "tfoot", "tr"],
  tr: ["td", "th"],
  td: [...flowContent, ...inlineContent],
  th: [...flowContent, ...inlineContent],
  thead: ["tr"],
  tbody: ["tr"],
  tfoot: ["tr"],
  form: [...flowContent, ...inlineContent],
  select: ["option", "optgroup"],
  optgroup: ["option"],
  main: flowContent,
  article: [...flowContent, ...inlineContent],
  section: [...flowContent, ...inlineContent],
  nav: [...flowContent, ...inlineContent],
  aside: [...flowContent, ...inlineContent],
  header: [...flowContent, ...inlineContent],
  footer: [...flowContent, ...inlineContent],
  figure: [...flowContent, ...inlineContent, "figcaption"],
  figcaption: [...flowContent, ...inlineContent],
  details: [...flowContent, ...inlineContent, "summary"],
  summary: inlineContent,
  blockquote: [...flowContent, ...inlineContent],
  address: [...flowContent, ...inlineContent],
  pre: inlineContent,
  video: ["source", "track"],
  audio: ["source", "track"],
  object: [...flowContent, ...inlineContent],
  abbr: inlineContent,
  cite: inlineContent,
};

// Function to check if one tag can be contained within another
export function canContain(parentTag: Tag, childTag: Tag): boolean {
  const allowedChildren = tagContainmentRules[parentTag];
  return allowedChildren ? allowedChildren.includes(childTag) : false;
}

// Function to get all tags that can contain a given tag
export function getValidParents(childTag: Tag): Tag[] {
  return Object.entries(tagContainmentRules)
    .filter(([_, children]) => children?.includes(childTag))
    .map(([parent, _]) => parent as Tag);
}

// Function to get all tags that a given tag can contain
export function getValidChildren(parentTag: Tag): Tag[] {
  return tagContainmentRules[parentTag] || [];
}
