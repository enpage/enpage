import { Liquid } from "liquidjs";
import { nanoid } from "nanoid";

export async function renderOnClient() {
  console.log("renderOnClient");
  const engine = new Liquid({});
  const ctx = window.enpage.context;

  document.querySelectorAll("template").forEach(async (template) => {
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
    const parsed = await engine.parseAndRender(content, ctx);

    // set the template id to all the generated elements
    const generatedElements = domStringToNode(parsed);
    generatedElements.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.setAttribute("ep-generated-from-template-id", templateId);
      }
    });

    // remove old elements with the same ep-generated-from-template-id
    // that may have been rendered before
    document.querySelectorAll(`[ep-generated-from-template-id="${templateId}"]`).forEach((el) => {
      el.remove();
    });

    // insert the generated elements after the original template
    template.after(generatedElements);

    // add the template id to the parent element
    template.parentElement?.setAttribute("ep-template-id", templateId);
  });

  // todo: prevent multiple renderings of the same template
  // parse ep-for attribute
  document.querySelectorAll("[ep-for]").forEach(async (el) => {
    const element = el as HTMLElement;
    const forValue = element.getAttribute("ep-for");
    if (forValue) {
      const tplContent = element.outerHTML;
      const parsed = await engine.parseAndRender(`{% for ${forValue} %}${tplContent}{% endfor %}`, ctx);
      // save innerContent in a <template> element
      const template = document.createElement("template");
      const templateId = nanoid(7);
      template.setAttribute("id", templateId);
      template.setAttribute("eb-generated-by", "builder");
      template.innerHTML = tplContent;

      // add template id to the original element
      element.setAttribute("ep-template-id", templateId);

      // append the template to the parent element
      element.parentElement?.appendChild(template);

      // transform parsed html string to dom nodes
      if (parsed) {
        // element.innerHTML = parsed;
        const nodes = domStringToNode(parsed).childNodes;
        nodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.setAttribute("ep-generated-from-template-id", templateId);
          }
        });
        // append nodes to parent element
        element.after(...nodes);
      }

      // finally remove the original element
      element.remove();
    }
  });

  // ep-if attribute
  document.querySelectorAll("[ep-if]").forEach(async (el) => {
    const element = el as HTMLElement;
    const ifValue = element.getAttribute("ep-if");
    if (ifValue) {
      // ep-if should not contain an expression (no {{ }}), but remove them just in case
      const expression = ifValue.replace(/^{{/, "").replace(/}}$/, "");
      // just evaluate the expression
      // const shouldRender = Boolean(await engine.parseAndRender(`{% if ${expression} %}true{% endif %}`, ctx));
      const shouldRender = await engine.evalValue(expression, ctx);
      if (!shouldRender) {
        // save the element in a template element
        const template = document.createElement("template");
        const templateId = nanoid(7);
        template.setAttribute("id", templateId);
        template.setAttribute("eb-generated-by", "builder");
        template.innerHTML = element.outerHTML;

        // append the template to the parent element
        element.parentElement?.appendChild(template);
        element.remove();
      }
    }
  });

  // parse all elements to find ep-bind:* attributes
  document.body.querySelectorAll("*").forEach(async (el) => {
    // filter elements that have the ep-bind:* attribute
    const attrs = el.getAttributeNames();

    const bindAttributes = attrs.filter((attr) => attr.startsWith("ep-bind:"));
    bindAttributes.forEach(async (attr) => {
      const attrName = attr.split(":")[1];
      const value = el.getAttribute(attr);
      if (value) {
        const expression = value.replace(/^{{/, "").replace(/}}$/, "");
        const parsed = await engine.evalValue(expression, ctx);
        // for boolean attributes, only set the attribute if the value is "true"
        if (parsed === false) {
          el.removeAttribute(attrName);
          return;
        }
        el.setAttribute(attrName, parsed);
      }
    });
  });

  // parse all elements with ep-bind attribute
  document.querySelectorAll("[ep-bind]").forEach(async (el) => {
    const element = el as HTMLElement;
    if (element.innerHTML) {
      const contents = await engine.parseAndRender(element.innerHTML, ctx);
      if (contents !== element.innerHTML) {
        element.innerHTML = contents;
      }
    }
  });
}

function domStringToNode(html: string) {
  const tempTpl = document.createElement("template");
  tempTpl.innerHTML = html;
  const generatedElements = tempTpl.content.cloneNode(true);
  return generatedElements;
}
