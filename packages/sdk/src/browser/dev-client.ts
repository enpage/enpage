// import { Liquid } from "liquidjs";
import { onDragOver, onDragEnd, getInsertPosition } from "./dnd";
import editorCss from "@enpage/style-system/editor.css?url";
import { debounce } from "lodash-es";

export type ElementSelectedPayload = {
  type: "element-selected";
  element: {
    tagName: string;
    innerHTML: string;
    innerText: string;
    outerHTML: string;
    computedStyles: string;
    attributes: Record<string, string>;
  };
};

export type DomUpdatedPayload = {
  type: "dom-updated";
  dom: string;
};

export type IframeFocusedPayload = {
  type: "iframe-focused";
};

export type IframeBlurredPayload = {
  type: "iframe-blurred";
};

export type IframeMessage =
  | ElementSelectedPayload
  | DomUpdatedPayload
  | IframeFocusedPayload
  | IframeBlurredPayload;

export type EditorDragEndPayload = {
  type: "editor-dragend";
  coordinates: { x: number; y: number };
};

export type EditorDragOverPayload = {
  type: "editor-dragover";
  template: string;
  coordinates: { x: number; y: number };
};

export type EditorDropPayload = {
  type: "editor-drop";
  template: string;
  coordinates: { x: number; y: number };
};

export type EditorMessage = EditorDragEndPayload | EditorDragOverPayload | EditorDropPayload;

export async function initDevClient() {
  // enable drag and drop on touch devices
  const currentURL = new URL(import.meta.url);
  const editorHost = `${currentURL.hostname}:3008`;
  const editorOrigin = `${currentURL.protocol}//${editorHost}`;

  // add a fixed pill at the bottom right of the page to go to switch to /editor.html
  // check if we are not in a iframe
  if (window.self === window.top) {
    const pill = document.createElement("div");
    pill.classList.add("ep-editor-link");
    pill.innerHTML = "View in editor";
    pill.onclick = () => {
      window.open(
        `http://${editorHost}/?templateUrl=${encodeURIComponent(window.location.href)}`,
        "enpage-editor",
      );
    };
    document.body.appendChild(pill);

    // For now, we only run the accessibility tests on the first page
    if (import.meta.env.DEV && window.location.search.includes("runtests")) {
      runAccessibilityTests();
    }

    //-----------------------------------
    // Editor context!
    //-----------------------------------
  } else {
    // add editor.css
    const editorCssEl = document.createElement("link");
    editorCssEl.rel = "stylesheet";
    editorCssEl.href = editorCss;
    document.head.appendChild(editorCssEl);

    // enable drag and drop on touch devices
    window.addEventListener("focus", () => {
      window.parent.postMessage({ type: "iframe-focused" } satisfies IframeFocusedPayload, editorOrigin);
    });

    window.addEventListener("blur", () => {
      window.parent.postMessage({ type: "iframe-blurred" } satisfies IframeBlurredPayload, editorOrigin);
    });

    document.body.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      console.log("click", target);
      // e.stopPropagation();
      if (target.hasAttribute("ep-editable") === false) {
        return;
      }

      e.stopPropagation();

      const element = e.target as HTMLElement;
      const elementClone = {
        tagName: element.tagName,
        innerHTML: element.innerHTML,
        innerText: element.innerText,
        outerHTML: element.outerHTML,
        label:
          element.getAttribute("ep-label") ?? element.getAttribute("title") ?? element.getAttribute("alt"),
        computedStyles: window.getComputedStyle(element).cssText,
        attributes: Array.from(element.attributes).reduce(
          (acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
      window.parent.postMessage(
        { type: "element-selected", element: elementClone } satisfies ElementSelectedPayload,
        editorOrigin,
      );
    });

    // post message to the parent window when an element with the [ep-editable] attribute is clicked
    // document.querySelectorAll("[ep-editable]").forEach((el) => {
    //   el.addEventListener(
    //     "click",
    //     (e) => {
    //       if (e.target !== e.currentTarget) {
    //         return;
    //       }

    //       const element = e.target as HTMLElement;
    //       const elementClone = {
    //         tagName: element.tagName,
    //         innerHTML: element.innerHTML,
    //         innerText: element.innerText,
    //         outerHTML: element.outerHTML,
    //         label:
    //           element.getAttribute("ep-label") ??
    //           element.getAttribute("title") ??
    //           element.getAttribute("alt"),
    //         computedStyles: window.getComputedStyle(element).cssText,
    //         attributes: Array.from(element.attributes).reduce(
    //           (acc, attr) => {
    //             acc[attr.name] = attr.value;
    //             return acc;
    //           },
    //           {} as Record<string, string>,
    //         ),
    //       };
    //       window.parent.postMessage(
    //         { type: "element-selected", element: elementClone } satisfies ElementSelectedPayload,
    //         editorOrigin,
    //       );
    //     },
    //     {},
    //   );
    // });

    // we are in the editor iframe, we want to disable all interactions like links, buttons, etc
    // we still want to intercept clicks, but we want to prevent their default behavior
    document.body.addEventListener("click", (e) => {
      const element = e.target as HTMLElement;
      if (element.tagName === "A" || element.tagName === "BUTTON") {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // listen for drag events
    window.addEventListener("message", (e) => {
      const data = e.data as EditorMessage;
      // console.log(data);
      switch (data.type) {
        case "editor-dragend":
          document.body.style.cursor = "default";
          onDragEnd();
          break;
        case "editor-dragover": {
          // transform the data.html string into a HTMLElement
          const dragElement = createDragElement(data);
          onDragOver(dragElement, data.coordinates);
          break;
        }
        case "editor-drop": {
          // handle drop
          const dragElement = createDragElement(data);
          const insertPosition = getInsertPosition({ dragElement, coordinates: data.coordinates });
          if (insertPosition) {
            const { referenceElement, side } = insertPosition;
            if (side.horizontal === "left" || side.vertical === "top") {
              // @ts-ignore before is wrongly typed by cloudflare/worker-types
              referenceElement.before(dragElement);
            } else {
              // @ts-ignore after is wrongly typed by cloudflare/worker-types
              referenceElement.after(dragElement);
            }
            setTimeout(dragElement.click, 100);
          }
          break;
        }
      }
    });

    const restoreOverflow = debounce(() => {
      document.body.style.opacity = "1";
    }, 50);

    document.body.style.transition = "all 0.2s";

    const resizeObserver = new ResizeObserver((entries) => {
      document.body.style.opacity = "0";
      document.body.style.transition = "all 50ms";
      restoreOverflow();
    });

    resizeObserver.observe(document.body, { box: "border-box" });
  }
}

function createDragElement(data: EditorDragOverPayload | EditorDropPayload) {
  const temp = document.createElement("div");
  if (!data.template) {
    throw Error("No template provided in the drag event");
  }
  temp.innerHTML = data.template;
  const dragElement = temp.firstElementChild as HTMLElement;
  return dragElement;
}

async function runAccessibilityTests() {
  const axe = (await import("axe-core")).default;
  const dontLocateTypes = ["page-has-heading-one"];

  axe.configure({
    branding: "Enpage",
  });

  axe
    .run({
      resultTypes: ["violations"],
    })
    .then((results) => {
      for (const violation of results.violations) {
        const foundIn = dontLocateTypes.includes(violation.id)
          ? ""
          : `Found in:\n\t${violation.nodes.map((node) => `- ${node.html}`).join("\n\n\t")}\n\n`;
        const message = `${violation.description}\n\n${foundIn}See: ${violation.helpUrl}`;
        if (violation.impact === "critical") {
          console.error(`[Accessibility error]: ${message}`);
        } else if (violation.impact === "serious" || violation.impact === "moderate") {
          console.warn(`[Accessibility warning]: ${message}`);
        }
      }
    })
    .catch((err) => {});
}
