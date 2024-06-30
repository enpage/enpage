import { Liquid } from "liquidjs";
import { nanoid } from "nanoid";

export async function renderOnClient() {
  const engine = new Liquid({});
  document.querySelectorAll("template[data-loop]").forEach(async (template) => {
    const tpl = template as HTMLTemplateElement;
    let templateId = tpl.getAttribute("id");
    if (!templateId) {
      templateId = nanoid(7);
      template.setAttribute("id", templateId);
    }
    const forloop = tpl.getAttribute("data-loop");

    let content = "";
    const templateNodes = tpl.content.childNodes;
    templateNodes.forEach((node) => {
      if (!(node instanceof HTMLTemplateElement)) {
        content += (node as HTMLElement).outerHTML || node.textContent;
      }
    });

    // Get the content of the template as a DocumentFragment
    const ctx = window._enpageCtx;
    const parsed = await engine.parseAndRender(`{% for ${forloop} %}${content}{% endfor %}`, ctx);

    // create a new template element with the parsed content
    const tempTpl = document.createElement("template");
    tempTpl.innerHTML = parsed;

    // set the template id to all the generated elements
    // todo: disable drag on generated elements
    const generatedElements = tempTpl.content.cloneNode(true);
    generatedElements.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.setAttribute("data-generated-from-template-id", templateId);
      }
    });

    // insert the generated elements after the original template
    template.after(generatedElements);

    // add the template id to the parent element
    template.parentElement?.setAttribute("data-template-id", templateId);
  });

  document.querySelectorAll("template[data-template]").forEach(async (template) => {
    const tpl = template as HTMLTemplateElement;
    let templateId = tpl.getAttribute("id");
    if (!templateId) {
      templateId = nanoid(7);
      template.setAttribute("id", templateId);
    }

    let content = "";
    const templateNodes = tpl.content.childNodes;
    templateNodes.forEach((node) => {
      if (!(node instanceof HTMLTemplateElement)) {
        content += (node as HTMLElement).outerHTML || node.textContent;
      }
    });

    // Get the content of the template as a DocumentFragment
    const ctx = window._enpageCtx;
    console.log("content", content);
    const parsed = await engine.parseAndRender(content, ctx);

    // create a new template element with the parsed content
    const tempTpl = document.createElement("template");
    tempTpl.innerHTML = parsed;

    // set the template id to all the generated elements
    // todo: disable drag on generated elements
    const generatedElements = tempTpl.content.cloneNode(true);
    generatedElements.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.setAttribute("data-generated-from-template-id", templateId);
      }
    });

    // insert the generated elements after the original template
    template.after(generatedElements);

    // add the template id to the parent element
    template.parentElement?.setAttribute("data-template-id", templateId);
  });

  // parse all elements with data-template attribute
  document.querySelectorAll("[data-template]").forEach(async (el) => {
    const element = el as HTMLElement;
    if (element.innerHTML) {
      const contents = await engine.parseAndRender(element.innerHTML, window._enpageCtx);
      if (contents !== element.innerHTML) {
        element.innerHTML = contents;
      }
    }
  });
}
